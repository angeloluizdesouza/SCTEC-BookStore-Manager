import * as readline from 'node:readline';
import { stdin as input } from 'node:process';
import { ConsoleUtils } from './ConsoleUtils';
import { DateUtils } from './DateUtils';

/**
 * Utilitário assíncrono para captura de entradas do usuário no terminal.
 * Suporta tanto sessões interativas em TTY quanto redirecionamento de streams (pipes/testes).
 */
export class PromptUtils {
  private static rl: readline.Interface | null = null;
  private static iterator: AsyncIterator<string> | null = null;

  /**
   * Obtém o iterador assíncrono único para leitura linha a linha do terminal.
   */
  private static getIterator(): AsyncIterator<string> {
    if (!this.rl) {
      this.rl = readline.createInterface({ input, terminal: false });
      this.iterator = this.rl[Symbol.asyncIterator]();
    }
    return this.iterator!;
  }

  /**
   * Fecha a interface do readline ao encerrar a aplicação.
   */
  public static close(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
      this.iterator = null;
    }
  }

  /**
   * Solicita um texto ao usuário. Permite valor padrão.
   */
  public static async askText(promptText: string, defaultValue?: string): Promise<string> {
    const promptDisplay = defaultValue !== undefined && defaultValue !== ''
      ? `${ConsoleUtils.BOLD}${promptText}${ConsoleUtils.RESET} ${ConsoleUtils.GRAY}[Padrão: ${defaultValue}]${ConsoleUtils.RESET}: `
      : `${ConsoleUtils.BOLD}${promptText}${ConsoleUtils.RESET}: `;

    process.stdout.write(promptDisplay);
    const iterator = this.getIterator();
    const result = await iterator.next();
    if (result.done) {
      return defaultValue ?? '';
    }
    const trimmed = result.value.trim();
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
    console.log(`\n${ConsoleUtils.GRAY}${message}${ConsoleUtils.RESET}`);
    const iterator = this.getIterator();
    await iterator.next();
  }
}
