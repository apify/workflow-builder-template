import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateBadgeInput } from "@/components/ui/template-badge-input";

/**
 * Scrape Single URL Config Fields Component
 * UI for configuring the scrape single URL action
 */
export function ScrapeSingleUrlConfigFields({
  config,
  onUpdateConfig,
  disabled,
}: {
  config: Record<string, unknown>;
  onUpdateConfig: (key: string, value: unknown) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <TemplateBadgeInput
          disabled={disabled}
          id="url"
          onChange={(value) => onUpdateConfig("url", value)}
          placeholder="https://example.com or {{NodeName.url}}"
          value={(config?.url as string) || ""}
        />
        <p className="text-muted-foreground text-xs">
          Enter the URL to scrape or use a template reference.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crawlerType">Crawler Type</Label>
        <Select
          disabled={disabled}
          onValueChange={(value) => onUpdateConfig("crawlerType", value)}
          value={(config?.crawlerType as string) || "playwright"}
        >
          <SelectTrigger className="w-full" id="crawlerType">
            <SelectValue placeholder="Select crawler type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="playwright:adaptive">Adaptive switching between browser and raw HTTP</SelectItem>
            <SelectItem value="playwright:firefox">Headless browser (Firefox+Playwright)</SelectItem>
            <SelectItem value="cheerio">Raw HTTP client (Cheerio)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          Select the crawler type to use for scraping.
        </p>
      </div>
    </div>
  );
}
