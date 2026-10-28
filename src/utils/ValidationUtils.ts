/**
 * Utilitários para validação de dados de entrada da aplicação.
 */
export class ValidationUtils {
  /**
   * Verifica se a string não é vazia nem consiste apenas de espaços.
   */
  public static isNotEmpty(val: string | null | undefined): boolean {
    return typeof val === 'string' && val.trim().length > 0;
  }

  /**
   * Valida formato básico de e-mail.
   */
  public static isValidEmail(email: string): boolean {
    if (!this.isNotEmpty(email)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Valida formato de telefone.
   */
  public static isValidPhone(phone: string): boolean {
    if (!this.isNotEmpty(phone)) return false;
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  }

  /**
   * Valida ano de publicação (positivo e até o próximo ano).
   */
  public static isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return Number.isInteger(year) && year > 0 && year <= currentYear + 1;
  }

  /**
   * Valida ID numérico positivo.
   */
  public static isValidId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }
}
