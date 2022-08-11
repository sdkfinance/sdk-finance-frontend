import {
  IRouteMiddlewareContext,
  routeMiddleware,
} from './middlewares/types/routeMiddleware';

type pipelineType = (
  context: IRouteMiddlewareContext,
  middleware: routeMiddleware[],
  index: number,
) => () => void;

const middlewarePipeline: pipelineType = (
  context,
  middlewares,
  index,
) => {
  const nextMiddleware = middlewares[index];

  if (!nextMiddleware) {
    return context.next;
  }

  return () => {
    const nextPipeline = middlewarePipeline(
      context,
      middlewares,
      index + 1,
    );

    nextMiddleware({ ...context, next: nextPipeline });
  };
};

export default middlewarePipeline;
