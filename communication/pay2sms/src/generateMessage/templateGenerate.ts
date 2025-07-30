import { renderTemplate } from "../mustache/mustacheHelper";
import { MustacheTemplateProps } from "../types/smsTypes";

/**
 * Renders a Mustache template with the provided data.
 *
 * @param data - An object containing key-value pairs to inject into the template.
 * @param props - An object containing the Mustache template string.
 * @returns A rendered string with the injected data.
 *
 * @example
 * const template = 'Hello, {{name}}!';
 * const message = generateMessage({ name: 'Alice' }, { template });
 * // message => 'Hello, Alice!'
 */
export const generateMessage = (
  props: MustacheTemplateProps,
  data: Record<string, any>
): string => {
  return renderTemplate(props.template, data);
};
