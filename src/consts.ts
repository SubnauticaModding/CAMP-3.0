export default {
  get API() {
    return {
      get DISCORD_TOKEN() { return process.env.API_DISCORD_TOKEN; },
    }
  },
  get CONFIG() {
    return {
      get PREFIX() { return process.env.CONFIG_PREFIX || "c/"; },
    }
  },
  get DISCORD() {
    return {
      get GUILD() { return process.env.DISCORD_GUILD || "324207629784186882"; },
    }
  },
  get FLAGS() {
    return {
      get SUBMIT_MOD_IDEAS_CHANNEL() { return process.env.FLAGS_SUBMIT_MOD_IDEAS_CHANNEL || "#SUBMITMODIDEASCHANNEL"; },
    }
  },
  get ROLES() {
    return {
      get MOD_IDEAS_MANAGER() { return process.env.ROLES_MOD_IDEAS_MANAGER || "640655772664987669"; },
      get MODERATOR() { return process.env.ROLES_MODERATOR || "336286670011760646"; },
    }
  },
  get WEBSITE() {
    return {
      get PORT() { return parseInt(process.env.WEBSITE_PORT || "3000"); },
      get PROJECT_DOMAIN() { return process.env.WEBSITE_PROJECT_DOMAIN || "subnauticamoddingbot"; },
    }
  },
};