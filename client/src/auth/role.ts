export type Role =
  | "STUDENT"
  | "TRAINER"
  | "INSTITUTION"
  | "PROGRAMME_MANAGER"
  | "MONITORING_OFFICER";

export const getRoleFromUser = (user: any): Role => {
  return user?.publicMetadata?.role;
};