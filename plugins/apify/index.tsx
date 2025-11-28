import { Globe } from "lucide-react";
import type { IntegrationPlugin } from "../registry";
import { registerIntegration } from "../registry";
import { runActorCodegenTemplate } from "./codegen/run-actor";
import { scrapeSingleUrlCodegenTemplate } from "./codegen/scrape-single-url";
import { ApifyIcon } from "./icon";
import { ApifySettings } from "./settings";
import { RunActorConfigFields } from "./steps/run-actor/config";
import { ScrapeSingleUrlConfigFields } from "./steps/scrape-single-url/config";
import { testApify } from "./test";

const apifyPlugin: IntegrationPlugin = {
  type: "apify",
  label: "Apify",
  description: "Run web scraping and automation Actors",

  icon: {
    type: "image",
    value: "/integrations/apify.svg",
  },

  settingsComponent: ApifySettings,

  formFields: [
    {
      id: "apifyApiKey",
      label: "API Token",
      type: "password",
      placeholder: "apify_api_...",
      configKey: "apifyApiKey",
      helpText: "Get your API token from ",
      helpLink: {
        text: "Apify Console",
        url: "https://console.apify.com/account/integrations",
      },
    },
  ],

  credentialMapping: (config) => {
    const creds: Record<string, string> = {};
    if (config.apifyApiKey) {
      creds.APIFY_API_KEY = String(config.apifyApiKey);
    }
    return creds;
  },

  testConfig: {
    testFunction: testApify,
  },

  actions: [
    {
      id: "Run Apify Actor",
      label: "Run Apify Actor",
      description: "Run an Apify Actor and get results",
      category: "Apify",
      icon: ApifyIcon,
      stepFunction: "apifyRunActorStep",
      stepImportPath: "run-actor",
      configFields: RunActorConfigFields,
      codegenTemplate: runActorCodegenTemplate,
    },
    {
      id: "Scrape Single URL",
      label: "Scrape Single URL",
      description: "Scrape a single URL and get markdown output",
      category: "Apify",
      icon: Globe,
      stepFunction: "scrapeSingleUrlStep",
      stepImportPath: "scrape-single-url",
      configFields: ScrapeSingleUrlConfigFields,
      codegenTemplate: scrapeSingleUrlCodegenTemplate,
    },
  ],
};

// Auto-register on import
registerIntegration(apifyPlugin);

export default apifyPlugin;
