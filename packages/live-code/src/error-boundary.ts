import * as React from "react";

type ErrorBoundaryProps = {
  children: React.ReactElement | null;
  onError: (err: string) => void;
};

type ErrorBoundaryState = {
  error?: string;
  lastSafeElement: React.ReactElement | null;
};

export class LiveCodeErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: undefined,
      lastSafeElement: null,
    };
  }
  static getDerivedStateFromError(error: any) {
    return { error: error.toString() };
  }
  componentDidUpdate(
    _prevProps: ErrorBoundaryProps,
    prevState: ErrorBoundaryState
  ) {
    if (this.state.error !== undefined) {
      if (this.props.children !== _prevProps.children) {
        console.log("unset error");
        this.setState({ error: undefined });
      }

      if (this.state.error !== prevState.error) {
        console.log("on error");
        this.props.onError(this.state.error);
      }
    } else if (this.state.lastSafeElement !== this.props.children) {
      console.log("set safe");
      this.setState({
        lastSafeElement: this.props.children,
      });
    }
  }

  render() {
    if (this.state.error) {
      // if the last "safe" element was the one that threw an error
      // we want to render null so we don't see the error again
      if (this.state.lastSafeElement === this.props.children) {
        return null;
      }
      return this.state.lastSafeElement;
    }
    return this.props.children;
  }
}
