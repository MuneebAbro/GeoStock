const LOG_PREFIX = '[GeoStock]';

function timestamp() {
  return new Date().toISOString();
}

function canLog() {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true';
}

export const log = {
  d(scope, message, data) {
    if (!canLog()) return;
    if (data !== undefined) {
      console.info(`${LOG_PREFIX} ${timestamp()} [${scope}] ${message}`, data);
      return;
    }
    console.info(`${LOG_PREFIX} ${timestamp()} [${scope}] ${message}`);
  },

  w(scope, message, data) {
    if (!canLog()) return;
    if (data !== undefined) {
      console.warn(`${LOG_PREFIX} ${timestamp()} [${scope}] ${message}`, data);
      return;
    }
    console.warn(`${LOG_PREFIX} ${timestamp()} [${scope}] ${message}`);
  },

  e(scope, message, error) {
    if (!canLog()) return;
    if (error !== undefined) {
      console.error(`${LOG_PREFIX} ${timestamp()} [${scope}] ${message}`, error);
      return;
    }
    console.error(`${LOG_PREFIX} ${timestamp()} [${scope}] ${message}`);
  },
};

export function logInfo(scope, message, data) {
  log.d(scope, message, data);
}

export function logWarn(scope, message, data) {
  log.w(scope, message, data);
}

export function logError(scope, message, error) {
  log.e(scope, message, error);
}

export function moduleLoaded(moduleName) {
  log.d(moduleName, 'module loaded');
}
