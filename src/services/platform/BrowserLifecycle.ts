export interface LifecycleState {
  setForegroundActive(active: boolean): void;
  flush(): Promise<void>;
}
export interface VisibilitySource extends EventTarget { readonly hidden: boolean }

/** Composition owns one registration. Flush on hide is best effort, never the durability plan. */
export function attachBrowserLifecycle(state: LifecycleState, visibility: VisibilitySource,
  page: EventTarget, report: (error: unknown) => void = console.error): () => void {
  const flush = (): void => { void state.flush().catch(report); };
  const onVisibility = (): void => {
    state.setForegroundActive(!visibility.hidden);
    if (visibility.hidden) flush();
  };
  const onPageHide = (): void => { state.setForegroundActive(false); flush(); };
  const onPageShow = (): void => { state.setForegroundActive(!visibility.hidden); };
  visibility.addEventListener('visibilitychange', onVisibility);
  page.addEventListener('pagehide', onPageHide);
  page.addEventListener('pageshow', onPageShow);
  onVisibility();
  return () => {
    visibility.removeEventListener('visibilitychange', onVisibility);
    page.removeEventListener('pagehide', onPageHide);
    page.removeEventListener('pageshow', onPageShow);
  };
}
