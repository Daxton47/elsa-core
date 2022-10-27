using System.Threading.Tasks;
using Elsa.Workflows.Core.Models;

namespace Elsa.Workflows.Core.Pipelines.ActivityExecution;

public delegate ValueTask ActivityMiddlewareDelegate(ActivityExecutionContext context);