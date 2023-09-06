export var PKG_HEAD_BYTES = 4;
export var MSG_FLAG_BYTES = 1;
export var MSG_ROUTE_CODE_BYTES = 2;
export var MSG_ID_MAX_BYTES = 5;
export var MSG_ROUTE_LEN_BYTES = 1;
export var MSG_ROUTE_CODE_MAX = 0xffff;
export var MSG_COMPRESS_ROUTE_MASK = 0x1;
export var MSG_COMPRESS_GZIP_MASK = 0x1;
export var MSG_COMPRESS_GZIP_ENCODE_MASK = 1 << 4;
export var MSG_TYPE_MASK = 0x7;
export var ERR_CONNECT_TIMEOUT = 'timeout';