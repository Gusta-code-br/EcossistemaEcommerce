class CircuitBreaker {
  constructor({ threshold = 3, timeout = 10000 } = {}) {
    this.state = "CLOSED";
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.nextAttempt = null;
  }

  async execute(fn) {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttempt) {
        const wait = Math.ceil((this.nextAttempt - Date.now()) / 1000);
        throw new Error(`[circuit-breaker] OPEN — estoque-service indisponível. Tente em ${wait}s`);
      }
      this.state = "HALF_OPEN";
      console.log("[circuit-breaker] Estado: HALF_OPEN — testando recuperação do estoque-service");
    }

    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (err) {
      this._onFailure();
      throw err;
    }
  }

  _onSuccess() {
    if (this.state === "HALF_OPEN") {
      console.log("[circuit-breaker] Estado: CLOSED — estoque-service recuperado");
    }
    this.failures = 0;
    this.state = "CLOSED";
  }

  _onFailure() {
    this.failures++;
    if (this.state === "HALF_OPEN" || this.failures >= this.threshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
      console.log(
        `[circuit-breaker] Estado: OPEN — ${this.failures} falha(s). Próxima tentativa em ${this.timeout / 1000}s`
      );
    } else {
      console.warn(`[circuit-breaker] Falha ${this.failures}/${this.threshold} — estado: CLOSED`);
    }
  }

  getStatus() {
    return {
      state: this.state,
      failures: this.failures,
      threshold: this.threshold,
      nextAttempt: this.state === "OPEN" ? new Date(this.nextAttempt).toISOString() : null,
    };
  }
}

module.exports = CircuitBreaker;
