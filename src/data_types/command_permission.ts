enum CommandPermission {
  None = 0,
  ModIdeasManager = 1,
  Moderator = 2,
  Administrator = 3,
  ServerAdministrator = 10,
  Developer = 99,
}

export default CommandPermission;