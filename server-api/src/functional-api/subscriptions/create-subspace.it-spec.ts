import { SubscriptionClient } from '@utils/subscriptions';
import { uniqueId } from '@utils/uniqueId';
import { deleteSpace } from '../journey/space/space.request.params';
import { subscriptionSubspaceCreated } from './subscrition-queries';
import { createOrgAndSpaceWithUsers } from '@utils/data-setup/entities';
import { createSubspace } from '@src/graphql/mutations/journeys/subspace';
import { entitiesId } from '../../types/entities-helper';
import { deleteOrganization } from '@functional-api/contributor-management/organization/organization.request.params';
import { TestUser } from '@alkemio/tests-lib';
import { delay } from '@alkemio/tests-lib';

const organizationName = 'com-sub-org-n' + uniqueId;
const hostNameId = 'com-sub-org-nd' + uniqueId;
const spaceName = 'com-sub-eco-n' + uniqueId;
const spaceNameId = 'com-sub-eco-nd' + uniqueId;
const subspaceDisplayName1 = 'ch1-display-name' + uniqueId;
const subspaceDisplayName2 = 'ch2-display-name' + uniqueId;
let subspaceIdOne = '';
let subspaceIdTwo = '';

let subscription1: SubscriptionClient;
let subscription2: SubscriptionClient;
let subscription3: SubscriptionClient;

beforeAll(async () => {
  await createOrgAndSpaceWithUsers(
    organizationName,
    hostNameId,
    spaceName,
    spaceNameId
  );
});

afterAll(async () => {
  subscription1.terminate();
  subscription2.terminate();
  subscription3.terminate();

  await deleteSpace(entitiesId.spaceId);
  await deleteOrganization(entitiesId.organization.id);
});
describe('Create subspace subscription', () => {
  beforeAll(async () => {
    subscription1 = new SubscriptionClient();
    subscription2 = new SubscriptionClient();
    subscription3 = new SubscriptionClient();

    const utilizedQuery = {
      operationName: 'SubspaceCreated',
      query: subscriptionSubspaceCreated,
      variables: { spaceID: entitiesId.spaceId },
    };

    await subscription1.subscribe(utilizedQuery, TestUser.GLOBAL_ADMIN);
    await subscription2.subscribe(utilizedQuery, TestUser.SPACE_ADMIN);
    await subscription3.subscribe(utilizedQuery, TestUser.SPACE_MEMBER);
  });

  afterAll(async () => {
    subscription1.terminate();
    subscription2.terminate();
    subscription3.terminate();
  });

  afterEach(async () => {
    await deleteSpace(subspaceIdOne);
    await deleteSpace(subspaceIdTwo);
  });

  it('receive newly created subspaces', async () => {
    // Create subspace
    const resOne = await createSubspace(
      subspaceDisplayName1,
      subspaceDisplayName1,
      entitiesId.spaceId
    );
    subspaceIdOne = resOne?.data?.createSubspace.id ?? '';

    const resTwo = await createSubspace(
      subspaceDisplayName2,
      subspaceDisplayName2,
      entitiesId.spaceId,
      TestUser.SPACE_ADMIN
    );
    subspaceIdTwo = resTwo?.data?.createSubspace.id ?? '';

    await delay(500);

    const expectedData = expect.arrayContaining([
      expect.objectContaining({
        subspaceCreated: {
          spaceID: entitiesId.spaceId,
          subspace: { profile: { displayName: subspaceDisplayName1 } },
        },
      }),
      expect.objectContaining({
        subspaceCreated: {
          spaceID: entitiesId.spaceId,
          subspace: { profile: { displayName: subspaceDisplayName2 } },
        },
      }),
    ]);

    // assert number of created subspaces
    expect(subscription1.getMessages().length).toBe(2);
    expect(subscription2.getMessages().length).toBe(2);
    expect(subscription3.getMessages().length).toBe(2);

    // assert the latest is from the correct mutation and mutation result
    expect(subscription1.getLatest()).toHaveProperty('subspaceCreated');
    expect(subscription2.getLatest()).toHaveProperty('subspaceCreated');
    expect(subscription3.getLatest()).toHaveProperty('subspaceCreated');

    // assert all newly created subspaces are displayed to subscribers
    expect(subscription1.getMessages()).toEqual(expectedData);
    expect(subscription2.getMessages()).toEqual(expectedData);
    expect(subscription3.getMessages()).toEqual(expectedData);
  });
});