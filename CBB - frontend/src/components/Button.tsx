import type { ButtonProps } from '../interfaces/ButtonInter';

function Button({
  children,
  type = 'button',
}: ButtonProps) {
  return (
    <button type={type}>
      {children}
    </button>
  );
}

export default Button;