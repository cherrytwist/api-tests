export const readPrivilege = ['READ'];
const cgrudPrivilege = [
  'CREATE',
  'GRANT',
  ...readPrivilege,
  'UPDATE',
  'DELETE',
];
const apply_join_Privilege = ['COMMUNITY_APPLY', 'COMMUNITY_JOIN'];
const cgrud_uc_com_Privilege = [
  ...cgrudPrivilege,
  'UPDATE_CANVAS',
  'CREATE_COMMENT',
];
const cgrud_cr_ccal_Privilege = [
  ...cgrudPrivilege,
  'CREATE_RELATION',
  'CREATE_CALLOUT',
];

const cgrud_ca_ccan_ucan_ccom_Privilege = [
  ...cgrudPrivilege,
  'CREATE_ASPECT',
  'CREATE_CANVAS',
  'UPDATE_CANVAS',
  'CREATE_COMMENT',
];

const cgrud_apply_join_innflow_Privilege = [
  ...cgrudPrivilege,
  ...apply_join_Privilege,
  'UPDATE_INNOVATION_FLOW',
];

const cgrud_apply_join_Privilege = [...cgrudPrivilege, ...apply_join_Privilege];

const cgrud_innflow_Privilege = [...cgrudPrivilege, 'UPDATE_INNOVATION_FLOW'];

const cgrud_authRes_Privilege = [...cgrudPrivilege, 'AUTHORIZATION_RESET'];

const read_creRel_Privilege = [...readPrivilege, 'CREATE_RELATION'];

const read_appl_join_Privilege = [...readPrivilege, ...apply_join_Privilege];

export const sortPrivileges = cgrudPrivilege.sort();
export const apply_join_sortedPrivilege = apply_join_Privilege.sort();
export const cgrud_uc_cc_sortedPrivileges = cgrud_uc_com_Privilege.sort();
export const cgrud_cr_cal_sortedPrivileges = cgrud_cr_ccal_Privilege.sort();
export const cgrud_ca_ccan_ucan_ccom_sortedPrivileges = cgrud_ca_ccan_ucan_ccom_Privilege.sort();
export const cgrud_apply_join_innflow_sortedPrivileges = cgrud_apply_join_innflow_Privilege.sort();
export const cgrud_apply_join_sortedPrivileges = cgrud_apply_join_Privilege.sort();
export const cgrud_innflow_sortedPrivileges = cgrud_innflow_Privilege.sort();
export const cgrud_authRes_sortedPrivileges = cgrud_authRes_Privilege.sort();
export const read_creRel_sortedPrivileges = read_creRel_Privilege.sort();
export const read_appl_join_sortedPrivileges = read_appl_join_Privilege.sort();