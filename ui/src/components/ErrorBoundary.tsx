import {
  cloneElement,
  Component,
  ErrorInfo,
  ReactElement,
  ReactNode,
} from 'react';

interface Props {
  children?: ReactNode;
  fallback: ReactElement;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return cloneElement(this.props.fallback, {
        error: this.state.error,
      });
    }

    return this.props.children;
  }
}
