import { TestUser } from '@alkemio/tests-lib';
import '@utils/array.matcher';
import {
  getSpaceData,
  getUserRoleSpacesVisibility,
  getPrivateSpaceData,
  getSpacesFilteredByVisibilityWithAccess,
  getSpacesFilteredByVisibilityNoAccess,
  updateSpaceSettings,
  updateSpacePlatformSettings,
} from './space.request.params';
import {
  createOrganization,
  deleteOrganization,
} from '@functional-api/contributor-management/organization/organization.request.params';
import {
  readPrivilege,
  sorted__create_read_update_delete_grant_createSubspace,
  sorted__create_read_update_delete_grant_authorizationReset_createSubspace_platformAdmin,
  sorted__create_read_update_delete_grant_createSubspace_platformAdmin,
} from '@common/constants/privileges';
import { SpacePrivacyMode, SpaceVisibility } from '@generated/alkemio-schema';
import { UniqueIDGenerator } from '@alkemio/tests-lib';
import { TestScenarioFactory } from '@src/scenario/TestScenarioFactory';
import { OrganizationWithSpaceModel } from '@src/scenario/models/OrganizationWithSpaceModel';
import { TestScenarioConfig } from '@src/scenario/config/test-scenario-config';

const uniqueId = UniqueIDGenerator.getID();

const spaceNameId = 'space-nameid' + uniqueId;
let organizationIdTwo = '';
let orgAccountIdTwo = '';

const organizationNameTwo = 'org2' + uniqueId;

let baseScenario: OrganizationWithSpaceModel;
const scenarioConfig: TestScenarioConfig = {
  name: 'space-platform-settings',
  space: {
    collaboration: {
      addCallouts: false,
    },
    community: { addAdmin: true, addMembers: true },
    subspace: {
      collaboration: {
        addCallouts: false,
      },
      community: { addAdmin: true, addMembers: true },
      subspace: {
        collaboration: {
          addCallouts: false,
        },
        community: { addAdmin: true, addMembers: true },
      },
    },
  },
};

describe('Update space platform settings', () => {
  beforeAll(async () => {
    baseScenario = await TestScenarioFactory.createBaseScenario(scenarioConfig);

   const a = await updateSpaceSettings(baseScenario.space.id, {
      privacy: {
        mode: SpacePrivacyMode.Private,
      },
    });
    console.log('moje li da pomaga supporta?',a.data);
  });

  afterAll(async () => {
    await TestScenarioFactory.cleanUpBaseScenario(baseScenario);
    await deleteOrganization(organizationIdTwo);
  });

  // Previously this was testing different host (account) for the space, to be updated after we have such mutation
  describe('Update space settings - functional', () => {
    beforeAll(async () => {
      const orgData = await createOrganization(
        organizationNameTwo,
        organizationNameTwo
      );
      organizationIdTwo = orgData?.data?.createOrganization.id ?? '';
      orgAccountIdTwo = orgData?.data?.createOrganization.account?.id ?? '';
    });

    afterAll(async () => {
      await updateSpacePlatformSettings(
        baseScenario.space.id,
        spaceNameId,
        SpaceVisibility.Active
      );
    });

    // Previously this was testing different host (account) for the space, to be updated after we have such mutation
    test('Update space settings', async () => {
      // Act
      await updateSpacePlatformSettings(
        baseScenario.space.id,
        spaceNameId,
        SpaceVisibility.Demo
      );

      const spaceData = await getSpaceData(baseScenario.space.id);
      const spaceSettings = spaceData?.data?.space;

      // Assert

      expect(spaceSettings?.visibility).toEqual(SpaceVisibility.Demo);
      expect(spaceSettings?.account.host?.id).toEqual(
        baseScenario.organization.id
      );
    });
  });

  describe('Authorization - Update space platform settings', () => {
    beforeAll(async () => {
      await updateSpacePlatformSettings(
        baseScenario.space.id,
        spaceNameId,
        SpaceVisibility.Active
      );
    });

    describe('DDT role access to private Space', () => {
      // Arrange
      test.each`
        user                             | spaceMyPrivileges
        ${TestUser.GLOBAL_ADMIN}         | ${sorted__create_read_update_delete_grant_createSubspace_platformAdmin}
        ${TestUser.GLOBAL_SUPPORT_ADMIN} | ${sorted__create_read_update_delete_grant_createSubspace_platformAdmin}
        ${TestUser.GLOBAL_LICENSE_ADMIN} | ${[]}
        ${TestUser.SPACE_ADMIN}          | ${sorted__create_read_update_delete_grant_createSubspace}
        ${TestUser.SPACE_MEMBER}         | ${readPrivilege}
        ${TestUser.NON_SPACE_MEMBER}     | ${[]}
      `(
        'User: "$user", should have private Space privileges: "$spaceMyPrivileges"',
        async ({ user, spaceMyPrivileges }) => {
          const request = await getPrivateSpaceData(
            baseScenario.space.id,
            user
          );
          const result = request?.data?.space;

          // Assert
          expect(result?.authorization?.myPrivileges?.sort()).toEqual(
            spaceMyPrivileges
          );
        }
      );
    });

    describe('DDT role access to public Space', () => {
      // Arrange
      beforeAll(async () => {
        await updateSpacePlatformSettings(
          baseScenario.space.id,
          spaceNameId,
          SpaceVisibility.Active
        );

        await updateSpaceSettings(baseScenario.space.id, {
          privacy: { mode: SpacePrivacyMode.Public },
        });
      });

      test.each`
        user                             | spaceMyPrivileges
        ${TestUser.GLOBAL_ADMIN}         | ${sorted__create_read_update_delete_grant_createSubspace_platformAdmin}
        ${TestUser.GLOBAL_SUPPORT_ADMIN} | ${sorted__create_read_update_delete_grant_createSubspace_platformAdmin}
        ${TestUser.GLOBAL_LICENSE_ADMIN} | ${readPrivilege}
        ${TestUser.SPACE_ADMIN}          | ${sorted__create_read_update_delete_grant_createSubspace}
        ${TestUser.SPACE_MEMBER}         | ${readPrivilege}
        ${TestUser.NON_SPACE_MEMBER}     | ${readPrivilege}
      `(
        'User: "$user", should have private Space privileges: "$spaceMyPrivileges"',
        async ({ user, spaceMyPrivileges }) => {
          const request = await getPrivateSpaceData(
            baseScenario.space.id,
            user
          );
          const result = request?.data?.space;

          // Assert
          expect(result?.authorization?.myPrivileges?.sort()).toEqual(
            spaceMyPrivileges
          );
        }
      );
    });
  });

  // ToDo remove skipped tests
  describe.skip('DDT role WITH access to public archived Space', () => {
    // Arrange
    beforeEach(async () => {
      await updateSpacePlatformSettings(
        baseScenario.space.id,
        spaceNameId,
        SpaceVisibility.Active
      );
    });

    beforeAll(async () => {
      await updateSpaceSettings(baseScenario.space.id, {
        privacy: { mode: SpacePrivacyMode.Public },
      });
    });

    test.each`
      user                             | email                         | communicationMyPrivileges                                                                  | subspacesCount | opportunitiesCount
      ${TestUser.GLOBAL_ADMIN}         | ${'admin@alkem.io'}           | ${sorted__create_read_update_delete_grant_authorizationReset_createSubspace_platformAdmin} | ${1}           | ${1}
      ${TestUser.GLOBAL_LICENSE_ADMIN} | ${'global.spaces@alkem.io'}   | ${sorted__create_read_update_delete_grant_authorizationReset_createSubspace_platformAdmin} | ${1}           | ${1}
      ${TestUser.GLOBAL_SUPPORT_ADMIN} | ${'community.admin@alkem.io'} | ${readPrivilege}                                                                           | ${1}           | ${1}
    `(
      'User role: "$user", have access to public archived Space',
      async ({ user, email, communicationMyPrivileges, subspacesCount }) => {
        // Arrange
        const getuserRoleSpaceDataBeforeArchive =
          await getUserRoleSpacesVisibility(email, SpaceVisibility.Active);
        const beforeVisibilityChangeAllSpaces =
          getuserRoleSpaceDataBeforeArchive?.data?.rolesUser.spaces;
        const dataBeforeVisibilityChange =
          beforeVisibilityChangeAllSpaces?.filter((obj: { nameID: string }) => {
            return obj.nameID.includes(spaceNameId);
          });
        await updateSpacePlatformSettings(
          baseScenario.space.id,
          spaceNameId,
          SpaceVisibility.Archived
        );

        const getUserRoleSpaceDataAfterArchive =
          await getUserRoleSpacesVisibility(email, SpaceVisibility.Archived);

        const afterVisibilityChangeAllSpaces =
          getUserRoleSpaceDataAfterArchive?.data?.rolesUser?.spaces;
        const dataAfterVisibilityChange =
          afterVisibilityChangeAllSpaces?.filter((obj: { nameID: string }) => {
            return obj.nameID.includes(spaceNameId);
          });

        const spaceDataAfterArchive =
          await getSpacesFilteredByVisibilityWithAccess(
            baseScenario.space.id,
            user
          );
        const allSpaces = spaceDataAfterArchive?.data?.spaces;
        const data = allSpaces?.filter((obj: { nameID: string }) => {
          return obj.nameID.includes(spaceNameId);
        });

        // Assert
        //expect(dataBeforeVisibilityChange).toEqual(dataAfterVisibilityChange);
        expect(data?.[0].visibility).toEqual(SpaceVisibility.Archived);
        expect(data?.[0].subspaces).toHaveLength(subspacesCount);
        expect(data?.[0].authorization?.myPrivileges?.sort()).toEqual(
          communicationMyPrivileges
        );
      }
    );
  });

  // ToDo remove skipped tests
  describe.skip('DDT role WITHOUT access to public archived Space', () => {
    // Arrange
    beforeEach(async () => {
      await updateSpacePlatformSettings(
        baseScenario.space.id,
        spaceNameId,
        SpaceVisibility.Active
      );
    });

    beforeAll(async () => {
      await updateSpaceSettings(baseScenario.space.id, {
        privacy: { mode: SpacePrivacyMode.Public },
      });
    });

    test.each`
      user                         | email                      | communicationMyPrivileges | subspacesCount | opportunitiesCount
      ${TestUser.SPACE_ADMIN}      | ${'space.admin@alkem.io'}  | ${[]}                     | ${null}        | ${null}
      ${TestUser.SPACE_MEMBER}     | ${'space.member@alkem.io'} | ${[]}                     | ${null}        | ${null}
      ${TestUser.NON_SPACE_MEMBER} | ${'non.space@alkem.io'}    | ${[]}                     | ${null}        | ${null}
    `(
      'User role: "$user", have NO access to public archived Space',
      async ({ user, email, communicationMyPrivileges }) => {
        const getuserRoleSpaceDataBeforeArchive =
          await getUserRoleSpacesVisibility(email, SpaceVisibility.Active);
        const beforeVisibilityChangeAllSpaces =
          getuserRoleSpaceDataBeforeArchive?.data?.rolesUser.spaces;
        const dataBeforeVisibilityChange =
          beforeVisibilityChangeAllSpaces?.filter((obj: { nameID: string }) => {
            return obj.nameID.includes(spaceNameId);
          });

        // Act
        await updateSpacePlatformSettings(
          baseScenario.space.id,
          spaceNameId,
          SpaceVisibility.Archived
        );

        const getUserRoleSpaceDataAfterArchive =
          await getUserRoleSpacesVisibility(email, SpaceVisibility.Archived);

        const afterVisibilityChangeAllSpaces =
          getUserRoleSpaceDataAfterArchive?.data?.rolesUser.spaces;
        const dataAfterVisibilityChange =
          afterVisibilityChangeAllSpaces?.filter((obj: { nameID: string }) => {
            return obj.nameID.includes(spaceNameId);
          });

        const spaceDataAfterArchive =
          await getSpacesFilteredByVisibilityNoAccess(
            baseScenario.space.id,
            user
          );

        const allSpaces = spaceDataAfterArchive?.data?.spaces;
        const data = allSpaces?.filter((obj: { nameID: string }) => {
          return obj.nameID.includes(spaceNameId);
        });
        // Assert
        //expect(dataBeforeVisibilityChange).toEqual(dataAfterVisibilityChange);
        expect(data?.[0].visibility).toEqual(SpaceVisibility.Archived);
        expect(data?.[0].authorization?.myPrivileges?.sort()).toEqual(
          communicationMyPrivileges
        );
      }
    );
  });
});
