import { injectStyle } from './injectStyle';
import { UseApp } from './interface';
import { loadApp } from './loadApp';
import { unmount } from './unmount';

/**
 * Use app script from remote
 *
 * # Example
 * ```ts
 * useApp({ target, loader: () => import('app1') }).then((unmount) => {});
 * ```
 */
export const useApp: UseApp = (options) => {
  return loadApp(options.loader, options.name).then((module) => {
    if (typeof module.default !== 'function') {
      throw new Error(
        `The current App should define default exported rendering functions.`
      );
    }
    const rootNode = document.createElement('div');
    rootNode.setAttribute('data-fronts', options.name ?? 'undefined');
    rootNode.setAttribute('data-time', Date.now().toString());
    options.target.appendChild(rootNode);
    injectStyle(rootNode, options.name);
    const renderNode = document.createElement('div');
    rootNode.appendChild(renderNode);
    // TODO: pass `props`
    const callback = module.default(renderNode);
    return () => {
      unmount(rootNode, options.name);
      callback && callback();
    };
  });
};