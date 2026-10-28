/**
 * Utilitários para formatação e manipulação de datas.
 */
export class DateUtils {
  /**
   * Formata um objeto Date para string no padrão brasileiro DD/MM/AAAA.
   */
  public static formatDate(date: Date | null | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Converte uma string no formato DD/MM/AAAA ou AAAA-MM-DD para objeto Date.
   * Retorna null caso a data seja inválida.
   */
  public static parseDate(dateStr: string): Date | null {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const trimmed = dateStr.trim();

    // Padrão DD/MM/AAAA
    const brPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const brMatch = trimmed.match(brPattern);
    if (brMatch) {
      const day = parseInt(brMatch[1], 10);
      const month = parseInt(brMatch[2], 10) - 1;
      const year = parseInt(brMatch[3], 10);
      const d = new Date(year, month, day);
      if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return d;
      }
      return null;
    }

    // Padrão ISO AAAA-MM-DD
    const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const isoMatch = trimmed.match(isoPattern);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10) - 1;
      const day = parseInt(isoMatch[3], 10);
      const d = new Date(year, month, day);
      if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return d;
      }
      return null;
    }

    return null;
  }

  /**
   * Retorna a diferença em dias corridos entre duas datas.
   */
  public static diffDays(d1: Date, d2: Date): number {
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
