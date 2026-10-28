/**
 * Utilitários de estilização e formatação para o terminal.
 */
export class ConsoleUtils {
  // Códigos de cor ANSI
  public static readonly RESET = '\x1b[0m';
  public static readonly BOLD = '\x1b[1m';
  public static readonly DIM = '\x1b[2m';
  public static readonly UNDERLINE = '\x1b[4m';

  public static readonly CYAN = '\x1b[36m';
  public static readonly BLUE = '\x1b[34m';
  public static readonly GREEN = '\x1b[32m';
  public static readonly YELLOW = '\x1b[33m';
  public static readonly RED = '\x1b[31m';
  public static readonly MAGENTA = '\x1b[35m';
  public static readonly WHITE = '\x1b[37m';
  public static readonly GRAY = '\x1b[90m';

  /**
   * Limpa a tela do console de forma portátil.
   */
  public static clear(): void {
    process.stdout.write('\x1Bc');
  }

  /**
   * Exibe o cabeçalho estilizado do sistema BookStore Manager.
   */
  public static printHeader(subTitle?: string): void {
    console.log(`${this.CYAN}${this.BOLD}========================================================================${this.RESET}`);
    console.log(`${this.CYAN}${this.BOLD}         📚  BOOKSTORE MANAGER - SISTEMA DE GESTÃO DE LIVRARIA         ${this.RESET}`);
    console.log(`${this.CYAN}${this.BOLD}========================================================================${this.RESET}`);
    if (subTitle) {
      console.log(`${this.MAGENTA}${this.BOLD}  >> ${subTitle.toUpperCase()} <<${this.RESET}`);
      console.log(`${this.GRAY}------------------------------------------------------------------------${this.RESET}`);
    }
  }

  /**
   * Exibe mensagem de sucesso.
   */
  public static success(message: string): void {
    console.log(`\n${this.GREEN}${this.BOLD}✔ [SUCESSO]:${this.RESET} ${this.GREEN}${message}${this.RESET}`);
  }

  /**
   * Exibe mensagem de erro de forma amigável.
   */
  public static error(message: string): void {
    console.log(`\n${this.RED}${this.BOLD}✖ [ERRO]:${this.RESET} ${this.RED}${message}${this.RESET}`);
  }

  /**
   * Exibe mensagem de aviso/alerta.
   */
  public static warn(message: string): void {
    console.log(`\n${this.YELLOW}${this.BOLD}⚠ [AVISO]:${this.RESET} ${this.YELLOW}${message}${this.RESET}`);
  }

  /**
   * Exibe mensagem informativa.
   */
  public static info(message: string): void {
    console.log(`${this.CYAN}ℹ [INFO]:${this.RESET} ${message}`);
  }

  /**
   * Linha divisória para organização visual.
   */
  public static divider(): void {
    console.log(`${this.GRAY}------------------------------------------------------------------------${this.RESET}`);
  }
}
