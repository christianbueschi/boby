import { defineRecipe } from '@chakra-ui/react';

const COMMON_VARIANT_PROPS = {
  px: 4,
  borderRadius: 'full',
  textStyle: 'sm',
};

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: '400',
    fontSize: '2rem',
    _focus: {
      outline: 'none', // overwrites chakra default
    },
  },
  variants: {
    variant: {
      solid: {
        ...COMMON_VARIANT_PROPS,
        color: 'white',
        bg: 'purple.500',
        _hover: {
          bg: 'orchid.500',
          _disabled: {
            bg: 'gray.500',
          },
        },
        _focus: {
          bg: 'orchid.500',
        },
        _disabled: {
          bg: 'gray.500',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'gray.200',
        },
      },
      surface: {
        ...COMMON_VARIANT_PROPS,
        color: 'gray.950',
        bg: 'white',
        _hover: {
          bg: 'gray.950',
          _disabled: {
            bg: 'gray.500',
          },
        },
        _focus: {
          bg: 'gray.950',
        },
        _disabled: {
          bg: 'gray.500',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'gray.200',
        },
      },
      subtle: {
        ...COMMON_VARIANT_PROPS,
        bg: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'purple.950',
        _hover: {
          color: 'white',
          borderColor: 'gray.950',
          bg: 'gray.950',
        },
        _disabled: {
          bg: 'white',
          color: 'gray.500',
          borderColor: 'gray.200',
        },
        _active: {
          bg: 'gray.950',
          color: 'white',
          borderColor: 'gray.950',
        },
      },
      subtleWhite: {
        ...COMMON_VARIANT_PROPS,
        bg: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'white',
        _hover: {
          color: 'white',
          borderColor: 'white',
          bg: 'white',
        },
        _disabled: {
          bg: 'white',
          color: 'gray.500',
          borderColor: 'gray.200',
        },
        _active: {
          bg: 'white',
          color: 'white',
          borderColor: 'white',
        },
      },
      ghost: {
        ...COMMON_VARIANT_PROPS,
        bg: 'transparent',
        color: 'white',
        _hover: {
          bg: 'purple.500',
          borderColor: 'transparent',
          color: 'white',
        },
        _focus: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
        _expanded: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
      },
      ghostWhite: {
        ...COMMON_VARIANT_PROPS,
        bg: 'transparent',
        color: 'white',
        _hover: {
          bg: 'white',
          borderColor: 'transparent',
          color: 'gray.950',
        },
        _focus: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
        _expanded: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
      },
    },
    size: {
      md: {
        h: 8,
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
});
