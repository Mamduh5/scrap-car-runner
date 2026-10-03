import { it, expect, vi } from 'vitest';
import { attachBrowserLifecycle } from './BrowserLifecycle';
it('pauses/resumes, flushes on hide, and removes every listener', async () => {
  const visibility = Object.assign(new EventTarget(), { hidden:false }); const page = new EventTarget();
  const state = { setForegroundActive:vi.fn(), flush:vi.fn(async () => {}) };
  const dispose = attachBrowserLifecycle(state, visibility, page);
  expect(state.setForegroundActive).toHaveBeenLastCalledWith(true);
  visibility.hidden = true; visibility.dispatchEvent(new Event('visibilitychange'));
  expect(state.setForegroundActive).toHaveBeenLastCalledWith(false); expect(state.flush).toHaveBeenCalledOnce();
  page.dispatchEvent(new Event('pagehide')); expect(state.flush).toHaveBeenCalledTimes(2);
  visibility.hidden = false; page.dispatchEvent(new Event('pageshow')); expect(state.setForegroundActive).toHaveBeenLastCalledWith(true);
  dispose(); dispose(); state.setForegroundActive.mockClear(); state.flush.mockClear();
  visibility.dispatchEvent(new Event('visibilitychange')); page.dispatchEvent(new Event('pagehide')); page.dispatchEvent(new Event('pageshow'));
  expect(state.setForegroundActive).not.toHaveBeenCalled(); expect(state.flush).not.toHaveBeenCalled();
});
it('reports failed best-effort flush without an unhandled rejection', async () => {
  const report = vi.fn(); const error = new Error('quota'); const page = new EventTarget();
  const dispose = attachBrowserLifecycle({ setForegroundActive: () => {}, flush: async () => { throw error; } }, Object.assign(new EventTarget(),{hidden:false}), page, report);
  page.dispatchEvent(new Event('pagehide')); await Promise.resolve(); expect(report).toHaveBeenCalledWith(error); dispose();
});
