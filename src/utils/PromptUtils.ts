import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { ConsoleUtils } from './ConsoleUtils';
import { DateUtils } from './DateUtils';

/**
 * Utilitário assíncrono para captura de entradas do usuário no terminal.
 */
export class PromptUtils {
  private static rl: readline.Interface | null = null;

  /**
   * Obtém a instância única de readline.Interface.
   */
  private static getInterface(): readline.Interface {
    if (!this.rl) {
      this.rl = readline.createInterface({ input, output });
    }
    return this.rl;
  }

  /**
   * Fecha a interface do readline ao encerrar a aplicação.
   */
  public static close(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
  }

  /**
   * Solicita um texto ao usuário. Permite valor padrão.
   */
  public static async askText(promptText: string, defaultValue?: string): Promise<string> {
    const rl = this.getInterface();
    const promptDisplay = defaultValue !== undefined && defaultValue !== ''
      ? `${ConsoleUtils.BOLD}${promptText}${ConsoleUtils.RESET} ${ConsoleUtils.GRAY}[Padrão: ${defaultValue}]${ConsoleUtils.RESET}: `
      : `${ConsoleUtils.BOLD}${promptText}${ConsoleUtils.RESET}: `;

    const answer = await rl.question(promptDisplay);
    const trimmed = answer.trim();
    if (trimmed === '' && defaultValue !== undefined) {
      return defaultValue;
    }
    return trimmed;
  }

  /**
   * Solicita um número inteiro válido ao usuário.
   */
  public static async askInt(promptText: string, defaultValue?: number): Promise<number> {
    while (true) {
      const defaultStr = defaultValue !== undefined ? String(defaultValue) : undefined;
      const response = await this.askText(promptText, defaultStr);
      const parsed = parseInt(response, 10);
      if (!isNaN(parsed) && String(parsed) === response) {
        return parsed;
      }
      ConsoleUtils.warn('Por favor, informe um número inteiro válido.');
    }
  }

  /**
   * Solicita uma data (DD/MM/AAAA) válida ao usuário.
   */
  public static async askDate(promptText: string, defaultDate?: Date): Promise<Date> {
    const defaultStr = defaultDate ? DateUtils.formatDate(defaultDate) : undefined;
    while (true) {
      const response = await this.askText(`${promptText} (DD/MM/AAAA)`, defaultStr);
      const parsed = DateUtils.parseDate(response);
      if (parsed) {
        return parsed;
      }
      ConsoleUtils.warn('Data inválida! Utilize o formato DD/MM/AAAA (ex: 25/12/1990).');
    }
  }

  /**
   * Solicita confirmação Sim/Não (S/N).
   */
  public static async askConfirm(promptText: string, defaultYes: boolean = false): Promise<boolean> {
    const hint = defaultYes ? '(S/n)' : '(s/N)';
    const answer = await this.askText(`${promptText} ${hint}`);
    if (answer === '') return defaultYes;
    const lower = answer.toLowerCase();
    return lower === 's' || lower === 'sim' || lower === 'y' || lower === 'yes';
  }

  /**
   * Pausa a execução e aguarda o usuário pressionar Enter.
   */
  public static async pause(message: string = 'Pressione Enter para continuar...'): Promise<void> {
    const rl = this.getInterface();
    console.log(`\n${ConsoleUtils.GRAY}${message}${ConsoleUtils.RESET}`);
    await rl.question('');
  }
}
