import '@test/utils/array.matcher';
import { deleteOrganizationCodegen } from '../organization/organization.request.params';
import { entitiesId } from '@test/functional-api/zcommunications/communications-helper';
import { uniqueId } from '@test/utils/mutations/create-mutation';
import { TestUser } from '@test/utils';
import { changePreferenceSpaceCodegen } from '@test/utils/mutations/preferences-mutation';
import { mutation } from '@test/utils/graphql.request';
import {
  sendComment,
  sendCommentVariablesData,
} from '@test/utils/mutations/communications-mutation';
import { joinCommunity } from '@test/functional-api/user-management/application/application.request.params';
import { users } from '@test/utils/queries/users-data';
import { createOrgAndSpaceCodegen } from '@test/utils/data-setup/entities';
import {
  ActivityEventType,
  CalloutState,
  CalloutType,
  CalloutVisibility,
  CommunityRole,
  SpacePreferenceType,
} from '@alkemio/client-lib/dist/types/alkemio-schema';
import { deleteSpaceCodegen } from '../integration/space/space.request.params';
import {
  createCalloutOnCollaborationCodegen,
  deleteCalloutCodegen,
  updateCalloutVisibilityCodegen,
} from '../integration/callouts/callouts.request.params';
import { getActivityLogOnCollaborationCodegen } from './activity-log-params';
import { assignCommunityRoleToUserCodegen } from '../integration/community/community.request.params';
import {
  PostTypes,
  createPostOnCalloutCodegen,
} from '../integration/post/post.request.params';
import { postCommentInCallout } from '../integration/comments/comments.request.params';
import { createWhiteboardOnCallout } from '../integration/whiteboard/whiteboard.request.params';

let calloutDisplayName = '';
let calloutId = '';
let postNameID = '';
let postDisplayName = '';

const organizationName = 'callout-org-name' + uniqueId;
const hostNameId = 'callout-org-nameid' + uniqueId;
const spaceName = 'callout-eco-name' + uniqueId;
const spaceNameId = 'callout-eco-nameid' + uniqueId;

beforeAll(async () => {
  await createOrgAndSpaceCodegen(
    organizationName,
    hostNameId,
    spaceName,
    spaceNameId
  );
  await changePreferenceSpaceCodegen(
    entitiesId.spaceId,
    SpacePreferenceType.MembershipJoinSpaceFromAnyone,
    'true'
  );
});

afterAll(async () => {
  await deleteSpaceCodegen(entitiesId.spaceId);
  await deleteOrganizationCodegen(entitiesId.organizationId);
});

beforeEach(async () => {
  calloutDisplayName = `callout-d-name-${uniqueId}`;
  postNameID = `post-name-id-${uniqueId}`;
  postDisplayName = `post-d-name-${uniqueId}`;
});

describe('Activity logs - Space', () => {
  afterEach(async () => {
    await deleteCalloutCodegen(calloutId);
  });
  test('should return only memberJoined', async () => {
    // Act
    const res = await getActivityLogOnCollaborationCodegen(
      entitiesId.spaceCollaborationId,
      5
    );
    const resActivityData = res?.data?.activityLogOnCollaboration;

    // Assert
    expect(resActivityData).toHaveLength(1);
    expect(resActivityData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          collaborationID: entitiesId.spaceCollaborationId,
          // eslint-disable-next-line quotes
          description: `[space] '${users.globalAdminNameId}'`,
          triggeredBy: { id: users.globalAdminId },
          type: ActivityEventType.MemberJoined,
        }),
      ])
    );
  });

  test('should NOT return CALLOUT_PUBLISHED, when created', async () => {
    // Arrange
    const res = await createCalloutOnCollaborationCodegen(
      entitiesId.spaceCollaborationId
    );
    calloutId = res.data?.createCalloutOnCollaboration.id ?? '';

    const resActivity = await getActivityLogOnCollaborationCodegen(
      entitiesId.spaceCollaborationId,
      5
    );

    const resActivityData = resActivity?.data?.activityLogOnCollaboration;

    // Assert
    expect(resActivityData).toHaveLength(1);
    expect(resActivityData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          collaborationID: entitiesId.spaceCollaborationId,
          // eslint-disable-next-line quotes
          description: `[space] '${users.globalAdminNameId}'`,
          triggeredBy: { id: users.globalAdminId },
          type: ActivityEventType.MemberJoined,
        }),
      ])
    );
  });

  test('should return MEMBER_JOINED, when user assigned from Admin or individually joined', async () => {
    // Arrange
    await joinCommunity(entitiesId.spaceCommunityId, TestUser.HUB_MEMBER);

    await assignCommunityRoleToUserCodegen(
      users.spaceAdminId,
      entitiesId.spaceCommunityId,
      CommunityRole.Member
    );
    // Act
    const resActivity = await getActivityLogOnCollaborationCodegen(
      entitiesId.spaceCollaborationId,
      5
    );
    const resActivityData = resActivity?.data?.activityLogOnCollaboration;

    // Assert
    expect(resActivityData).toHaveLength(3);
    expect(resActivityData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          collaborationID: entitiesId.spaceCollaborationId,
          // eslint-disable-next-line quotes
          description: `[space] '${users.spaceAdminNameId}'`,
          triggeredBy: { id: users.globalAdminId },
          type: ActivityEventType.MemberJoined,
        }),
      ])
    );

    expect(resActivityData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          collaborationID: entitiesId.spaceCollaborationId,
          // eslint-disable-next-line quotes
          description: `[space] '${users.globalAdminNameId}'`,
          triggeredBy: { id: users.globalAdminId },
          type: ActivityEventType.MemberJoined,
        }),
      ])
    );

    expect(resActivityData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          collaborationID: entitiesId.spaceCollaborationId,
          // eslint-disable-next-line quotes
          description: `[space] '${users.spaceMemberNameId}'`,
          triggeredBy: { id: users.spaceMemberId },
          type: ActivityEventType.MemberJoined,
        }),
      ])
    );
  });

  // To be updated with the changes related to whiteboard callouts
  test.skip('should return CALLOUT_PUBLISHED, POST_CREATED, POST_COMMENT, DISCUSSION_COMMENT, WHITEBOARD_CREATED', async () => {
    // Arrange
    const res = await createCalloutOnCollaborationCodegen(
      entitiesId.spaceCollaborationId
    );
    calloutId = res.data?.createCalloutOnCollaboration.id ?? '';

    await updateCalloutVisibilityCodegen(
      calloutId,
      CalloutVisibility.Published
    );

    const resPostonSpace = await createPostOnCalloutCodegen(
      calloutId,
      { displayName: postDisplayName },
      postNameID,
      PostTypes.KNOWLEDGE,
      TestUser.GLOBAL_ADMIN
    );
    const postDataCreate =
      resPostonSpace.data?.createContributionOnCallout.post;
    const postCommentsIdSpace = postDataCreate?.comments.id ?? '';

    const messageRes = await mutation(
      sendComment,
      sendCommentVariablesData(
        postCommentsIdSpace,
        'test message on space post'
      ),
      TestUser.GLOBAL_ADMIN
    );
    messageRes.body.data.sendMessageToRoom.id;

    const resDiscussion = await createCalloutOnCollaborationCodegen(
      entitiesId.spaceCollaborationId,
      {
        framing: {
          profile: {
            displayName: calloutDisplayName + 'disc',
            description: 'discussion callout',
          },
        },
        contributionPolicy: {
          state: CalloutState.Open,
        },
        type: CalloutType.Post,
      }
    );
    const calloutIdDiscussion =
      resDiscussion.data?.createCalloutOnCollaboration.id ?? '';

    await updateCalloutVisibilityCodegen(
      calloutIdDiscussion,
      CalloutVisibility.Published
    );

    await postCommentInCallout(
      calloutIdDiscussion,
      'comment on discussion callout'
    );

    const resWhiteboard = await createCalloutOnCollaborationCodegen(
      entitiesId.spaceCollaborationId,
      {
        framing: {
          profile: {
            displayName: calloutDisplayName + 'whiteboard',
            description: 'whiteboard callout',
          },
        },
        contributionPolicy: {
          state: CalloutState.Open,
        },
        type: CalloutType.Whiteboard,
      }
    );
    const calloutIdWhiteboard =
      resWhiteboard.data?.createCalloutOnCollaboration.id ?? '';

    await updateCalloutVisibilityCodegen(
      calloutIdWhiteboard,
      CalloutVisibility.Published
    );

    await createWhiteboardOnCallout(calloutIdWhiteboard, 'callout whiteboard');

    // Act
    const resActivity = await getActivityLogOnCollaborationCodegen(
      entitiesId.spaceCollaborationId,
      7
    );

    const resActivityData = resActivity?.data?.activityLogOnCollaboration;
    const expextedData = async (description: string, type: string) => {
      return expect.arrayContaining([
        expect.objectContaining({
          collaborationID: entitiesId.spaceCollaborationId,
          description,
          triggeredBy: { id: users.globalAdminId },
          type,
        }),
      ]);
    };

    // Assert
    expect(resActivityData).toHaveLength(7);
    expect(resActivityData).toEqual(
      await expextedData(
        `[${calloutDisplayName}] - callout description`,
        ActivityEventType.CalloutPublished
      )
    );
    expect(resActivityData).toEqual(
      await expextedData(
        `[${postDisplayName}] - `,
        ActivityEventType.CalloutPostCreated
      )
    );
    expect(resActivityData).toEqual(
      await expextedData(
        'test message on space post',
        ActivityEventType.CalloutPostComment
      )
    );
    expect(resActivityData).toEqual(
      await expextedData(
        `[${calloutDisplayName + 'disc'}] - discussion callout`,
        ActivityEventType.CalloutPublished
      )
    );
    expect(resActivityData).toEqual(
      await expextedData(
        'comment on discussion callout',
        ActivityEventType.DiscussionComment
      )
    );
    expect(resActivityData).toEqual(
      await expextedData(
        `[${calloutDisplayName + 'whiteboard'}] - whiteboard callout`,
        ActivityEventType.CalloutPublished
      )
    );
    expect(resActivityData).toEqual(
      await expextedData(
        '[callout whiteboard]',
        ActivityEventType.CalloutWhiteboardCreated
      )
    );
  });
});

// Logs used in the tests below are from the previously executed tests in the file
describe('Access to Activity logs - Space', () => {
  beforeAll(async () => {
    await assignCommunityRoleToUserCodegen(
      users.spaceAdminId,
      entitiesId.spaceCommunityId,
      CommunityRole.Admin
    );
  });

  describe('DDT user privileges to Private Space activity logs', () => {
    // Arrange
    test.each`
      userRole                 | message
      ${TestUser.GLOBAL_ADMIN} | ${entitiesId.challengeCollaborationId}
      ${TestUser.HUB_ADMIN}    | ${entitiesId.challengeCollaborationId}
      ${TestUser.HUB_MEMBER}   | ${entitiesId.challengeCollaborationId}
    `(
      'User: "$userRole" get message: "$message", when intend to access Private space activity logs',
      async ({ userRole, message }) => {
        // Act
        const resActivity = await getActivityLogOnCollaborationCodegen(
          entitiesId.spaceCollaborationId,
          5,
          userRole
        );

        // Assert
        expect(
          resActivity.data?.activityLogOnCollaboration[0]?.collaborationID
        ).toContain(message);
      }
    );

    test.each`
      userRole                   | message
      ${TestUser.NON_HUB_MEMBER} | ${'Authorization'}
    `(
      'User: "$userRole" get Error message: "$message", when intend to access Private space activity logs',
      async ({ userRole, message }) => {
        // Act
        const resActivity = await getActivityLogOnCollaborationCodegen(
          entitiesId.spaceCollaborationId,
          5,
          userRole
        );

        // Assert
        expect(resActivity.error?.errors[0]?.message).toContain(message);
      }
    );
  });

  describe('DDT user privileges to Public Space activity logs', () => {
    beforeAll(async () => {
      await changePreferenceSpaceCodegen(
        entitiesId.spaceId,
        SpacePreferenceType.AuthorizationAnonymousReadAccess,
        'true'
      );
    });
    // Arrange
    test.each`
      userRole                   | message
      ${TestUser.GLOBAL_ADMIN}   | ${entitiesId.challengeCollaborationId}
      ${TestUser.HUB_ADMIN}      | ${entitiesId.challengeCollaborationId}
      ${TestUser.HUB_MEMBER}     | ${entitiesId.challengeCollaborationId}
      ${TestUser.NON_HUB_MEMBER} | ${entitiesId.challengeCollaborationId}
    `(
      'User: "$userRole" get message: "$message", when intend to access Public space activity logs',
      async ({ userRole, message }) => {
        // Act
        const resActivity = await getActivityLogOnCollaborationCodegen(
          entitiesId.spaceCollaborationId,
          5,
          userRole
        );

        // Assert
        expect(
          resActivity.data?.activityLogOnCollaboration[0]?.collaborationID
        ).toContain(message);
      }
    );
  });
});