import type {
    SpawnOptionsWithoutStdio, SpawnOptionsWithStdioTuple,
    StdioPipe, StdioNull, SpawnOptions
} from 'child_process';

export type CmdOptions = SpawnOptionsWithoutStdio             |
SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>   |
SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>   |
SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>   |
SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>   |
SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>   |
SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>   |
SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>   |
SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>   |
SpawnOptions;
