type OriginRule = string | RegExp | ((origin: string) => boolean);

const getAllowedOrigins = () => {
  const allowedOrigins = Bun.env.ALLOWED_ORIGINS;

  if (typeof allowedOrigins === 'string') {
    return allowedOrigins.split(',');
  }

  return [];
};

function isString(s: OriginRule): s is string {
	return typeof s === 'string' || s instanceof String;
}

export function isOriginAllowed(origin: string, allowedOrigin: OriginRule | OriginRule[] = getAllowedOrigins()) {
	if (Array.isArray(allowedOrigin)) {
		for (const allowed of allowedOrigin) {
			if (isOriginAllowed(origin, allowed)) {
				return true;
			}
		}

		return false;
	} else if (isString(allowedOrigin)) {
		return origin === allowedOrigin;
	} else if (allowedOrigin instanceof RegExp) {
		return allowedOrigin.test(origin);
	}

	return allowedOrigin(origin);
}

export function isRefererAllowed(referer: string, allowedOrigin: OriginRule | OriginRule[] = getAllowedOrigins()) {
	try {
		const origin = new URL(referer).origin;

		return isOriginAllowed(origin, allowedOrigin);
	} catch (_) {
		return false;
	}
}

const headerFilters = [/^Sec-/i, /^Accept/i, /^User-Agent$/i];

export function cloneHeader(source: Headers) {
	let headers: Record<string, string> = {};

	for (const [key, value] of source.entries()) {
		if (headerFilters.some((filter) => filter.test(key))) {
			headers[key] = value;
		}
	}

	return headers;
}
