import { organizationData } from '@utils/common-params';
import { graphqlRequestAuth } from '@utils/graphql.request';
import { TestUser } from '@common/enum/test.user';
import { getGraphqlClient } from '@utils/graphqlClient';
import { graphqlErrorWrapper } from '@utils/graphql.wrapper';
import { UpdateOrganizationSettingsEntityInput } from '@generated/graphql';

import { uniqueId } from '@utils/uniqueId';
export const organizationName = `testorghost${uniqueId}`;
export const hostNameId = `testorghost${uniqueId}`;

export const createOrganization = async (
  organizationName: string,
  nameID: string,
  legalEntityName?: string,
  domain?: string,
  website?: string,
  contactEmail?: string,
  userRole: TestUser = TestUser.GLOBAL_ADMIN
) => {
  const graphqlClient = getGraphqlClient();
  const callback = (authToken: string | undefined) =>
    graphqlClient.CreateOrganization(
      {
        organizationData: {
          nameID,
          legalEntityName,
          domain,
          website,
          contactEmail,
          profileData: {
            displayName: organizationName,
            referencesData: [
              {
                description: 'test ref',
                name: 'test ref neame',
                uri: 'https://testref.io',
              },
            ],
          },
        },
      },
      {
        authorization: `Bearer ${authToken}`,
      }
    );

  return graphqlErrorWrapper(callback, userRole);
};

export const deleteOrganization = async (
  organizationId: string,
  userRole: TestUser = TestUser.GLOBAL_ADMIN
) => {
  const graphqlClient = getGraphqlClient();
  const callback = (authToken: string | undefined) =>
    graphqlClient.deleteOrganization(
      {
        deleteData: {
          ID: organizationId,
        },
      },
      {
        authorization: `Bearer ${authToken}`,
      }
    );

  return graphqlErrorWrapper(callback, userRole);
};

export const updateOrganization = async (
  organizationId: string,
  options?: {
    legalEntityName?: string;
    domain?: string;
    website?: string;
    contactEmail?: string;
    profileData?: {
      displayName?: string;
      tagline?: string;
      location?: { country?: string; city?: string };
      description?: string;
    };
  },
  userRole: TestUser = TestUser.GLOBAL_ADMIN
) => {
  const graphqlClient = getGraphqlClient();
  const callback = (authToken: string | undefined) =>
    graphqlClient.updateOrganization(
      {
        organizationData: {
          ID: organizationId,
          ...options,
        },
      },
      {
        authorization: `Bearer ${authToken}`,
      }
    );

  return graphqlErrorWrapper(callback, userRole);
};

export const getOrganizationData = async (
  organizationId: string,
  userRole: TestUser = TestUser.GLOBAL_ADMIN
) => {
  const graphqlClient = getGraphqlClient();
  const callback = (authToken: string | undefined) =>
    graphqlClient.getOrganizationData(
      {
        organizationId,
      },
      {
        authorization: `Bearer ${authToken}`,
      }
    );
  return graphqlErrorWrapper(callback, userRole);
};

export const getOrganizationsData = async (
  userRole: TestUser = TestUser.GLOBAL_ADMIN
) => {
  const requestParams = {
    operationName: null,
    query: `query{organizations ${organizationData}}`,
    variables: null,
  };

  return await graphqlRequestAuth(requestParams, userRole);
};

export const updateOrganizationSettings = async (
  organizationID: string,
  settingsData: UpdateOrganizationSettingsEntityInput,
  userRole: TestUser = TestUser.GLOBAL_ADMIN,
) => {
  const graphqlClient = getGraphqlClient();
  const callback = (authToken: string | undefined) =>
    graphqlClient.updateOrganizationSettings(
      {
        organizationID,
        settingsData
      },
      {
        authorization: `Bearer ${authToken}`,
      }
    );

  return graphqlErrorWrapper(callback, userRole);
};