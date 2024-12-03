/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/biokey.json`.
 */
export type Biokey = {
  "address": "HXEPyKzidcNAbnNWY1DMu433eBcN4nP1m381QdVKQe2S",
  "metadata": {
    "name": "biokey",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkAuthentication",
      "discriminator": [
        129,
        62,
        67,
        246,
        230,
        126,
        238,
        205
      ],
      "accounts": [
        {
          "name": "user",
          "docs": [
            "user performing the authentication check"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "authState",
          "docs": [
            "The PDA storing the user's authentication state"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": [],
      "returns": "bool"
    },
    {
      "name": "createOrUpdateAuthState",
      "discriminator": [
        239,
        69,
        221,
        15,
        42,
        73,
        118,
        91
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "authState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "isAuthenticated",
          "type": "bool"
        }
      ]
    },
    {
      "name": "createUserAccount",
      "discriminator": [
        146,
        68,
        100,
        69,
        63,
        46,
        182,
        199
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "hashedFingerprint",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "fetchUserFingerprint",
      "discriminator": [
        229,
        48,
        83,
        85,
        129,
        236,
        11,
        78
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": [],
      "returns": {
        "array": [
          "u8",
          32
        ]
      }
    },
    {
      "name": "validateFingerprint",
      "discriminator": [
        111,
        128,
        215,
        193,
        147,
        130,
        139,
        15
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "docs": [
            "The PDA account storing the user's hashed fingerprint"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "providedHashedFingerprint",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ],
      "returns": "bool"
    }
  ],
  "accounts": [
    {
      "name": "authState",
      "discriminator": [
        20,
        35,
        164,
        183,
        66,
        69,
        78,
        224
      ]
    },
    {
      "name": "userAccountState",
      "discriminator": [
        32,
        153,
        70,
        190,
        135,
        71,
        10,
        113
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidPublicKey",
      "msg": "The provided public key does not match the expected owner."
    }
  ],
  "types": [
    {
      "name": "authState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isAuthenticated",
            "type": "bool"
          },
          {
            "name": "lastAuthTime",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hashedFingerprint",
            "docs": [
              "Hashed fingerprint of the user (32 bytes, e.g., SHA-256)"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "publicKey",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Timestamp when the account was created"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
