/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";

export interface FheAMMInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "PIDs"
      | "Pools"
      | "_getOtherTokenAddr"
      | "addLiquidity"
      | "createPool"
      | "swap"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "PIDs", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "Pools", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "_getOtherTokenAddr",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [BigNumberish, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createPool",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [BytesLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "PIDs", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "Pools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_getOtherTokenAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
}

export interface FheAMM extends BaseContract {
  connect(runner?: ContractRunner | null): FheAMM;
  waitForDeployment(): Promise<this>;

  interface: FheAMMInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  PIDs: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  Pools: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, bigint] & {
        token0: string;
        token1: string;
        reserve0: bigint;
        reserve1: bigint;
      }
    ],
    "view"
  >;

  _getOtherTokenAddr: TypedContractMethod<
    [PID: BigNumberish, _token0: AddressLike],
    [string],
    "view"
  >;

  addLiquidity: TypedContractMethod<
    [PID: BigNumberish, amount_token0: BytesLike, amount_token1: BytesLike],
    [void],
    "nonpayable"
  >;

  createPool: TypedContractMethod<
    [_token0: AddressLike, _token1: AddressLike],
    [bigint],
    "nonpayable"
  >;

  swap: TypedContractMethod<
    [_amount: BytesLike, _tokenIn: AddressLike, _PID: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "PIDs"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "Pools"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, bigint] & {
        token0: string;
        token1: string;
        reserve0: bigint;
        reserve1: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "_getOtherTokenAddr"
  ): TypedContractMethod<
    [PID: BigNumberish, _token0: AddressLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "addLiquidity"
  ): TypedContractMethod<
    [PID: BigNumberish, amount_token0: BytesLike, amount_token1: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createPool"
  ): TypedContractMethod<
    [_token0: AddressLike, _token1: AddressLike],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "swap"
  ): TypedContractMethod<
    [_amount: BytesLike, _tokenIn: AddressLike, _PID: BigNumberish],
    [void],
    "nonpayable"
  >;

  filters: {};
}
