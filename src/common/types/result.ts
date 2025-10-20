export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; message: string; error?: unknown };

export const Result = {
  success<T>(value: T): Result<T> {
    return { ok: true, value };
  },

  failure<T = never>(message: string, error?: unknown): Result<T> {
    return { ok: false, message, error };
  },

};


// type Result<T> = un molde de galleta (dice la forma que debe tener la galleta: redonda o cuadrada).
// Result.success = una máquina que hace galletas redondas.
// Result.failure = otra máquina que hace galletas cuadradas.