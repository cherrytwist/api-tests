import {
  entitiesId,
  users,
} from '@test/functional-api/zcommunications/communications-helper';
import {
  createOrgAndHub,
  createChallengeForOrgHub,
  createOpportunityForChallenge,
} from '@test/functional-api/zcommunications/create-entities-with-users-helper';
import {
  assignUserAsCommunityLeadFunc,
  assignUserAsCommunityMemberFunc,
} from '@test/utils/mutations/assign-mutation';
import { uniqueId } from '@test/utils/mutations/create-mutation';
import {
  removeUserAsCommunityLeadFunc,
  removeUserAsCommunityMemberFunc,
} from '@test/utils/mutations/remove-mutation';
import { removeChallenge } from '../challenge/challenge.request.params';
import { removeHub } from '../hub/hub.request.params';
import { removeOpportunity } from '../opportunity/opportunity.request.params';
import { deleteOrganization } from '../organization/organization.request.params';
import {
  dataChallengeMemberTypes,
  dataHubMemberTypes,
  dataOpportunityMemberTypes,
} from './community.request.params';

const organizationName = 'com-org-name' + uniqueId;
const hostNameId = 'com-org-nameid' + uniqueId;
const hubName = 'com-eco-name' + uniqueId;
const hubNameId = 'com-eco-nameid' + uniqueId;
const opportunityName = 'com-opp';
const challengeName = 'com-chal';

beforeAll(async () => {
  await createOrgAndHub(organizationName, hostNameId, hubName, hubNameId);
  await createChallengeForOrgHub(challengeName);
  await createOpportunityForChallenge(opportunityName);
});

afterAll(async () => {
  await removeOpportunity(entitiesId.opportunityId);
  await removeChallenge(entitiesId.challengeId);
  await removeHub(entitiesId.hubId);
  await deleteOrganization(entitiesId.organizationId);
});

describe('Assign / Remove users to community', () => {
  describe('Assign users', () => {
    afterAll(async () => {
      await removeUserAsCommunityLeadFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );
      await removeUserAsCommunityLeadFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );
      await removeUserAsCommunityLeadFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );
      await removeUserAsCommunityMemberFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );
      await removeUserAsCommunityMemberFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );
      await removeUserAsCommunityMemberFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );
    });
    test('Assign user as member to hub', async () => {
      // Act
      await assignUserAsCommunityMemberFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataHubMemberTypes(entitiesId.hubId);
      const data = getCommunityData[0];

      // Assert
      expect(data).toHaveLength(2);
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });

    test('Assign user as member to challenge', async () => {
      // Act
      await assignUserAsCommunityMemberFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataChallengeMemberTypes(
        entitiesId.hubId,
        entitiesId.challengeId
      );
      const data = getCommunityData[0];

      // Assert
      expect(data).toHaveLength(2);
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Assign user as member to opportunity', async () => {
      // Act
      await assignUserAsCommunityMemberFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataOpportunityMemberTypes(
        entitiesId.hubId,
        entitiesId.opportunityId
      );
      const data = getCommunityData[0];

      // Assert
      expect(data).toHaveLength(2);
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });

    test('Assign user as lead to hub', async () => {
      // Act
      await assignUserAsCommunityLeadFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );
      const getCommunityData = await dataHubMemberTypes(entitiesId.hubId);
      const data = getCommunityData[2];

      // Assert
      expect(data).toHaveLength(1);
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Assign user as lead to challenge', async () => {
      // Act
      await assignUserAsCommunityLeadFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataChallengeMemberTypes(
        entitiesId.hubId,
        entitiesId.challengeId
      );
      const data = getCommunityData[2];

      // Assert
      expect(data).toHaveLength(1);
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Assign user as lead to opportunity', async () => {
      // Act
      await assignUserAsCommunityLeadFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataChallengeMemberTypes(
        entitiesId.hubId,
        entitiesId.opportunityId
      );
      const data = getCommunityData[2];

      // Assert
      expect(data).toHaveLength(1);
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
  });

  describe('Remove users', () => {
    beforeAll(async () => {
      await assignUserAsCommunityMemberFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );
      await assignUserAsCommunityMemberFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );
      await assignUserAsCommunityMemberFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );
      await assignUserAsCommunityLeadFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );
      await assignUserAsCommunityLeadFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );
      await assignUserAsCommunityLeadFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );
    });
    test('Remove user as lead from opportunity', async () => {
      // Act
      await removeUserAsCommunityLeadFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataOpportunityMemberTypes(
        entitiesId.hubId,
        entitiesId.opportunityId
      );
      const data = getCommunityData[2];

      // Assert
      expect(data).toHaveLength(0);
      expect(data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Remove user as lead from challenge', async () => {
      // Act
      await removeUserAsCommunityLeadFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataChallengeMemberTypes(
        entitiesId.hubId,
        entitiesId.opportunityId
      );
      const data = getCommunityData[2];

      // Assert
      expect(data).toHaveLength(0);
      expect(data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Remove user as lead from hub', async () => {
      // Act
      await removeUserAsCommunityLeadFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataHubMemberTypes(entitiesId.hubId);
      const data = getCommunityData[2];

      // Assert
      expect(data).toHaveLength(0);
      expect(data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });

    test('Remove user as member from opportunity', async () => {
      // Act
      await removeUserAsCommunityMemberFunc(
        entitiesId.opportunityCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataOpportunityMemberTypes(
        entitiesId.hubId,
        entitiesId.opportunityId
      );
      const data = getCommunityData[0];

      // Assert
      expect(data).toHaveLength(1);
      expect(data).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Remove user as member from challenge', async () => {
      // Act
      await removeUserAsCommunityMemberFunc(
        entitiesId.challengeCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataChallengeMemberTypes(
        entitiesId.hubId,
        entitiesId.challengeId
      );
      const data = getCommunityData[0];

      // Assert
      expect(data).toHaveLength(1);
      expect(data).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
    test('Remove user as member from hub', async () => {
      // Act
      await removeUserAsCommunityMemberFunc(
        entitiesId.hubCommunityId,
        users.nonHubMemberEmail
      );

      const getCommunityData = await dataHubMemberTypes(entitiesId.hubId);
      const data = getCommunityData[0];

      // Assert
      expect(data).toHaveLength(1);
      expect(data).toEqual(
        expect.not.arrayContaining([
          expect.objectContaining({
            email: users.nonHubMemberEmail,
          }),
        ])
      );
    });
  });
});