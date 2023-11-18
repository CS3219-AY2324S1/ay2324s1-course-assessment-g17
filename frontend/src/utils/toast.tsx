import { useToast, type UseToastOptions } from '@chakra-ui/react';

export default class ToastWrapper {
  private readonly toast = useToast();
  private readonly useToastDefaults: UseToastOptions = {
    duration: 5000,
    isClosable: true,
  };

  private showToast(options: UseToastOptions, status: UseToastOptions['status']): void {
    this.toast({ ...this.useToastDefaults, ...options, status } satisfies UseToastOptions);
  }

  public showInfoToast(options: UseToastOptions): void {
    this.showToast(options, 'info');
  }

  public showSuccessToast(options: UseToastOptions): void {
    this.showToast(options, 'success');
  }

  public showWarningToast(options: UseToastOptions): void {
    this.showToast(options, 'warning');
  }

  public showErrorToast(options: UseToastOptions): void {
    this.showToast(options, 'error');
  }

  public showLoadingToast(options: UseToastOptions): void {
    this.showToast(options, 'loading');
  }
}
