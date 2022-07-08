const JWT_ERRORS = {
	EMPTY_JWT_PROVIDED: 'EMPTY_JWT_PROVIDED',
	INVALID_JWT_FORMAT: 'INVALID_JWT_FORMAT',
	INVALID_JWT_HEADER: 'INVALID_JWT_HEADER',
	INVALID_JWT_HEADER_TYPE: 'INVALID_JWT_HEADER_TYPE',
	INVALID_JWT_PAYLOAD: 'INVALID_JWT_PAYLOAD',
	INVALID_JWT_SIGNATURE: 'INVALID_JWT_SIGNATURE',
	INVALID_ISSUER_FORMAT: 'INVALID_ISSUER_FORMAT',
	INVALID_SUBJECT_FORMAT: 'INVALID_SUBJECT_FORMAT',
	INVALID_EXPIRATION_DATE: 'INVALID_EXPIRATION_DATE',
	INVALID_PUBLIC_CLAIM: 'INVALID_PUBLIC_CLAIM',
	INVALID_SUBJECT_CLAIM: 'INVALID_SUBJECT_CLAIM',
	IMMUTABLE_PUBLIC_CLAIM: 'IMMUTABLE_PUBLIC_CLAIM',
	INVALID_CONTEXT_URI: 'INVALID_CONTEXT_URI',
	INVALID_CONTEXT_TYPE: 'INVALID_CONTEXT_TYPE',
	IMMUTABLE_SUBJECT_CLAIM: 'IMMUTABLE_SUBJECT_CLAIM',
	INVALID_SUBJECT_ID: 'INVALID_SUBJECT_ID',
	PROVIDED_SUBJECT_ID_NOT_PRESENT: 'PROVIDED_SUBJECT_ID_NOT_PRESENT',
	JWT_TOKEN_EXPIRED: 'JWT_TOKEN_EXPIRED',
	JWT_TOKEN_NOT_ACTIVE: 'JWT_TOKEN_NOT_ACTIVE',
	ROOT_OF_TRUST_NOT_VALID: 'ROOT_OF_TRUST_NOT_VALID',
	AUDIENCE_OF_PRESENTATION_NOT_DEFINED: 'AUDIENCE_OF_PRESENTATION_NOT_DEFINED',
	HOLDER_AND_VERIFIER_MUST_BE_DID: 'HOLDER_AND_VERIFIER_MUST_BE_DID'
};


const JWT_DEFAULTS = {
	ALG: 'ES256',
	TYP: 'JWT',
	VC_VP_CONTEXT_CREDENTIALS: 'https://www.w3.org/2018/credentials/v1',
	VC_TYPE: 'VerifiableCredential',
	VP_TYPE: 'VerifiablePresentation',
	EXP: (365 * 24 * 60 * 60), // 1 year default,
	EMPTY_VC_VP: {
		context: [], type: []
	}
};

const LABELS = {
	ISSUER_DID: 'issuerDID',
	ISSUER_SSI: 'issuerSSI',
	SUBJECT_DID: 'subjectDID',
	SUBJECT_SSI: 'subjectSSI'
};

function getDefaultJWTOptions() {
	const now = Date.now();
	return {
		iat: now, nbf: now, exp: now + JWT_DEFAULTS.EXP
	};
}

const IMMUTABLE_PUBLIC_CLAIMS = ['vc', 'vp', 'iss', 'sub', 'iat', 'verifiableCredential', 'holder'];

const VALIDATION_STRATEGIES = {
	DEFAULT: "DEFAULT",
	ROOTS_OF_TRUST: "ROOTS_OF_TRUST",
	INVALID_VALIDATION_STRATEGY: "INVALID_VALIDATION_STRATEGY"
};

module.exports = {
	JWT_DEFAULTS,
	JWT_ERRORS,
	LABELS,
	IMMUTABLE_PUBLIC_CLAIMS,
	getDefaultJWTOptions: getDefaultJWTOptions,
	VALIDATION_STRATEGIES
};