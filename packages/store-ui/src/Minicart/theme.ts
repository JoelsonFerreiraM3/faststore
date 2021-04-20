import type { SxStyleProp } from 'theme-ui'

const theme: SxStyleProp = {
  bg: 'muted',

  button: {
    bg: 'transparent',
    position: 'relative',
    cursor: 'pointer',

    badge: {
      bg: 'secondary',
      borderRadius: '100%',
      height: 16,
      position: 'absolute',
      width: 16,
      top: 0,
      right: 0,
      fontSize: 10,
    },
  },

  drawer: {
    container: {
      zIndex: 99999,
      display: 'flex',
      bg: 'background',
      height: '100%',
      flexDirection: 'column',
      overflow: 'hidden',
    },

    mask: {
      bg: 'primary',
      opacity: 0.5,
      zIndex: 9999,
    },

    header: {
      p: 3,

      title: {
        pt: 3,
      },
    },

    content: {
      flexDirection: 'column',
      flex: 1,
      overflow: 'auto',
      px: 3,

      product: {
        py: 3,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'muted',

        '&:last-child': {
          borderWidth: 0,
        },

        image: {
          minWidth: '150px',
        },

        name: {
          flexDirection: 'column',
          ml: 3,

          text: {
            fontWeight: 400,
            fontSize: '14px',
            height: '60px',
            marginTop: '0.5rem',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },

          value: {
            mt: 3,
            free: {
              color: 'green',
            },
          },
        },
      },
    },

    footer: {
      p: 3,
      flexDirection: 'column',
      boxShadow: '0 0 12px rgba(0,0,0,.15)',

      subtotal: {
        justifyContent: 'space-between',
      },

      total: {
        justifyContent: 'space-between',

        text: {
          fontSize: 4,
        },

        value: {
          fontSize: 4,
        },
      },

      'shipping-disclaimer': {
        my: 3,
      },
    },
  },
} as any

export const minicartTheme: SxStyleProp = {
  minicart: {
    default: theme,
  },
}
