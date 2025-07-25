import React, { ChangeEvent, KeyboardEvent } from 'react';
import classnames from 'classnames';

import {
  BackgroundColor,
  BorderColor,
  BorderRadius,
  IconColor,
  Display,
  AlignItems,
} from '../../../helpers/constants/design-system';

import { type PolymorphicRef, Box } from '../box';
import { Text, type TextProps } from '../text';
import { Icon, IconName } from '../icon';
import type { CheckboxProps, CheckboxComponent } from './checkbox.types';

export const Checkbox: CheckboxComponent = React.forwardRef(
  // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
  // eslint-disable-next-line @typescript-eslint/naming-convention
  <C extends React.ElementType = 'div'>(
    {
      id,
      isChecked,
      isIndeterminate,
      isDisabled,
      isReadOnly,
      isRequired,
      onChange,
      className = '',
      iconProps,
      inputProps,
      inputRef,
      title,
      name,
      label,
      ...props
    }: CheckboxProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const handleCheckboxKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onChange?.(event as unknown as ChangeEvent<HTMLInputElement>);
      }
    };

    // If no title is provided, use the label as the title only if the label is a string
    const sanitizedTitle =
      // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !title && typeof label === 'string' ? label : title || id;

    return (
      <Text
        className={classnames('mm-checkbox', className, {
          'mm-checkbox--disabled': Boolean(isDisabled),
        })}
        as="label"
        display={Display.InlineFlex}
        alignItems={AlignItems.center}
        ref={ref}
        htmlFor={id}
        {...(props as TextProps<C>)}
      >
        <span className="mm-checkbox__input-wrapper">
          <Box
            as="input"
            type="checkbox"
            title={sanitizedTitle}
            name={name}
            id={id}
            checked={isChecked}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            data-indeterminate={isIndeterminate}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (isReadOnly) {
                event.preventDefault();
              } else {
                onChange?.(event);
              }
            }}
            onKeyDown={handleCheckboxKeyDown}
            margin={0}
            marginRight={label ? 2 : 0}
            backgroundColor={
              // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              isChecked || isIndeterminate
                ? BackgroundColor.primaryDefault
                : BackgroundColor.backgroundDefault
            }
            borderColor={
              // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              isChecked || isIndeterminate
                ? BorderColor.primaryDefault
                : BorderColor.borderDefault
            }
            borderRadius={BorderRadius.SM}
            borderWidth={2}
            display={Display.Flex}
            ref={inputRef}
            {...inputProps}
            className={classnames(
              'mm-checkbox__input',
              inputProps?.className ?? '',
              {
                'mm-checkbox__input--checked': Boolean(isChecked),
                'mm-checkbox__input--indeterminate': Boolean(isIndeterminate),
                'mm-checkbox__input--readonly': Boolean(isReadOnly),
              },
            )}
          />
          {/* TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31880 */}
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          {(isChecked || isIndeterminate) && (
            <Icon
              color={IconColor.primaryInverse}
              name={isChecked ? IconName.CheckBold : IconName.MinusBold}
              className={classnames(
                'mm-checkbox__icon',
                iconProps?.className ?? '',
              )}
              {...iconProps}
            />
          )}
        </span>
        {label ? <span>{label}</span> : null}
      </Text>
    );
  },
);
