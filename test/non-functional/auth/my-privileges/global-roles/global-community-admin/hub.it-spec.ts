import {
  AspectTypes,
  createAspectOnCallout,
  getDataPerHubCallout,
} from '@test/functional-api/integration/aspect/aspect.request.params';
import {
  getHubData,
  removeHub,
} from '@test/functional-api/integration/hub/hub.request.params';
import { deleteOrganization } from '@test/functional-api/integration/organization/organization.request.params';
import { createRelation } from '@test/functional-api/integration/relations/relations.request.params';
import { createApplication } from '@test/functional-api/user-management/application/application.request.params';
import {
  entitiesId,
  users,
} from '@test/functional-api/zcommunications/communications-helper';
import { createOrgAndHub } from '@test/functional-api/zcommunications/create-entities-with-users-helper';
import { TestUser } from '@test/utils';
import { mutation } from '@test/utils/graphql.request';
import {
  assignUserAsGlobalCommunityAdmin,
  removeUserAsGlobalCommunityAdmin,
} from '@test/utils/mutations/authorization-mutation';
import {
  createDiscussion,
  createDiscussionVariablesData,
  DiscussionCategory,
} from '@test/utils/mutations/communications-mutation';
import { uniqueId } from '@test/utils/mutations/create-mutation';
import {
  changePreferenceHub,
  HubPreferenceType,
} from '@test/utils/mutations/preferences-mutation';
import {
  sendCommunityUpdate,
  sendCommunityUpdateVariablesData,
} from '@test/utils/mutations/update-mutation';
import {
  cgrud_apply_join_sortedPrivileges,
  readPrivilege,
  read_creRel_sortedPrivileges,
  sortPrivileges,
} from '../../common';

const organizationName = 'auth-ga-org-name' + uniqueId;
const hostNameId = 'auth-ga-org-nameid' + uniqueId;
const hubName = 'auth-ga-eco-name' + uniqueId;
const hubNameId = 'auth-ga-eco-nameid' + uniqueId;

beforeAll(async () => {
  await createOrgAndHub(organizationName, hostNameId, hubName, hubNameId);
  await changePreferenceHub(
    entitiesId.hubId,
    HubPreferenceType.ANONYMOUS_READ_ACCESS,
    'false'
  );

  await changePreferenceHub(
    entitiesId.hubId,
    HubPreferenceType.APPLICATIONS_FROM_ANYONE,
    'true'
  );
  await changePreferenceHub(
    entitiesId.hubId,
    HubPreferenceType.JOIN_HUB_FROM_ANYONE,
    'true'
  );
  await changePreferenceHub(
    entitiesId.hubId,
    HubPreferenceType.JOIN_HUB_FROM_HOST_ORGANIZATION_MEMBERS,
    'true'
  );

  await createApplication(entitiesId.hubCommunityId, TestUser.QA_USER);

  await mutation(
    createDiscussion,
    createDiscussionVariablesData(
      entitiesId.hubCommunicationId,
      DiscussionCategory.GENERAL,
      'test'
    )
  );

  await mutation(
    sendCommunityUpdate,
    sendCommunityUpdateVariablesData(entitiesId.hubUpdatesId, 'test'),
    TestUser.GLOBAL_ADMIN
  );

  await createRelation(
    entitiesId.hubCollaborationId,
    'incoming',
    'relationDescription',
    'relationActorName',
    'relationActorRole',
    'relationActorType',
    TestUser.GLOBAL_ADMIN
  );

  await createAspectOnCallout(
    entitiesId.hubCalloutId,
    'aspectDisplayName',
    'aspectnameid',
    'aspectDescription',
    AspectTypes.KNOWLEDGE,
    TestUser.GLOBAL_ADMIN
  );

  await assignUserAsGlobalCommunityAdmin(users.hubMemberId);
});
afterAll(async () => {
  await removeHub(entitiesId.hubId);
  await deleteOrganization(entitiesId.organizationId);
  await removeUserAsGlobalCommunityAdmin(users.hubMemberId);
});

describe('myPrivileges', () => {
  test('GlobalCommunityAdmin privileges to Hub', async () => {
    // Act
    const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
    const data = response.body.data.hub.authorization.myPrivileges;

    // Assert
    expect(data.sort()).toEqual(readPrivilege);
  });

  describe('Community', () => {
    test('GlobalCommunityAdmin privileges to Hub / Community', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data = response.body.data.hub.community.authorization.myPrivileges;

      // Assert
      expect(data.sort()).toEqual(cgrud_apply_join_sortedPrivileges);
    });

    test('GlobalCommunityAdmin privileges to Hub / Community / Application', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.community.applications[0].authorization
          .myPrivileges;

      // Assert
      expect(data.sort()).toEqual(sortPrivileges);
    });

    test('GlobalCommunityAdmin privileges to Hub / Community / Communication', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.community.communication.authorization
          .myPrivileges;

      // Assert
      expect(data.sort()).toEqual(sortPrivileges);
    });

    test('GlobalCommunityAdmin privileges to Hub / Community / Communication / Discussion', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.community.communication.discussions[0]
          .authorization.myPrivileges;

      // Assert
      expect(data.sort()).toEqual(sortPrivileges);
    });

    test('GlobalCommunityAdmin privileges to Hub / Community / Communication / Updates', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.community.communication.updates.authorization
          .myPrivileges;

      // Assert
      expect(data.sort()).toEqual(sortPrivileges);
    });
  });

  describe('Collaboration', () => {
    test('GlobalCommunityAdmin privileges to Hub / Collaboration', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.collaboration.authorization.myPrivileges;

      // Assert
      expect(data.sort()).toEqual(read_creRel_sortedPrivileges);
    });

    // Skip due to bug: https://app.zenhub.com/workspaces/alkemio-development-5ecb98b262ebd9f4aec4194c/issues/alkem-io/server/2143
    test.skip('GlobalCommunityAdmin privileges to Hub / Collaboration / Relations', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.collaboration.relations[0].authorization
          .myPrivileges;

      // Assert
      expect(data).toEqual([
        'CREATE',
        'GRANT',
        'READ',
        'UPDATE',
        'DELETE',
        'CREATE_RELATION',
        'CREATE_CALLOUT',
      ]);
    });

    test('GlobalCommunityAdmin privileges to Hub / Collaboration / Callout', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.collaboration.callouts[0].authorization
          .myPrivileges;

      // Assert
      expect(data.sort()).toEqual(readPrivilege);
    });

    test('GlobalCommunityAdmin privileges to Hub / Collaboration / Callout / Aspect', async () => {
      // Act
      const response = await getDataPerHubCallout(
        entitiesId.hubId,
        entitiesId.hubCalloutId,
        TestUser.HUB_MEMBER
      );
      const data =
        response.body.data.hub.collaboration.callouts[0].aspects[0]
          .authorization.myPrivileges;

      // Assert
      expect(data.sort()).toEqual(readPrivilege);
    });

    // ToDo
    test.skip('GlobalCommunityAdmin privileges to Hub / Collaboration / Callout / Canvas', async () => {
      // Act
      const response = await getDataPerHubCallout(
        entitiesId.hubId,
        entitiesId.hubCalloutId,
        TestUser.HUB_MEMBER
      );
      const data =
        response.body.data.hub.collaboration.callouts[0].aspects[0]
          .authorization.myPrivileges;

      // Assert
      expect(data).toEqual([
        'CREATE',
        'GRANT',
        'READ',
        'UPDATE',
        'DELETE',
        'UPDATE_CANVAS',
        'CREATE_COMMENT',
      ]);
    });

    // ToDo
    test.skip('GlobalCommunityAdmin privileges to Hub / Collaboration / Callout / Comments', async () => {
      // Act
      const response = await getDataPerHubCallout(
        entitiesId.hubId,
        entitiesId.hubCalloutId,
        TestUser.HUB_MEMBER
      );
      const data =
        response.body.data.hub.collaboration.callouts[0].aspects[0]
          .authorization.myPrivileges;

      // Assert
      expect(data).toEqual([
        'CREATE',
        'GRANT',
        'READ',
        'UPDATE',
        'DELETE',
        'UPDATE_CANVAS',
        'CREATE_COMMENT',
      ]);
    });
  });

  describe('Templates', () => {
    test('GlobalCommunityAdmin privileges to Hub / Templates', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data = response.body.data.hub.templates.authorization.myPrivileges;

      // Assert
      expect(data.sort()).toEqual(readPrivilege);
    });

    test('GlobalCommunityAdmin privileges to Hub / Templates / Aspect', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.templates.aspectTemplates[0].authorization
          .myPrivileges;

      // Assert
      expect(data.sort()).toEqual(readPrivilege);
    });

    test('GlobalCommunityAdmin privileges to Hub / Templates / Lifecycle', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.templates.lifecycleTemplates[0].authorization
          .myPrivileges;

      // Assert
      expect(data.sort()).toEqual(readPrivilege);
    });

    // ToDo
    test.skip('GlobalCommunityAdmin privileges to Hub / Templates / Canvas', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data =
        response.body.data.hub.templates.canvasTemplates[0].authorization
          .myPrivileges;

      // Assert
      expect(data).toEqual(['READ']);
    });
  });

  describe('Preferences', () => {
    test('GlobalCommunityAdmin privileges to Hub / Preferences', async () => {
      // Act
      const response = await getHubData(entitiesId.hubId, TestUser.HUB_MEMBER);
      const data = response.body.data.hub.preferences;

      // Assert
      data.map((item: any) => {
        expect(item.authorization.myPrivileges.sort()).toEqual(readPrivilege);
      });
    });
  });
});