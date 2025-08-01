import mustache from "mustache";

/**
 * Generic mustache template renderer
 * @param template - The mustache template string
 * @param templateData - The data to inject into the template
 * @returns Rendered string
 */
export const renderTemplate = (template: string, templateData: any): string => {
  return mustache.render(template, templateData);
};
