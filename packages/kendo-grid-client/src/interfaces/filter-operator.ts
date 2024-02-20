/**
 * Represents the list of supported [`FilterDescriptor`]({% slug api_kendo-data-query_filterdescriptor %}) operators.
 * Allows restricting `FilterDescriptor.operator` definition to available values only.
 */
export declare enum FilterOperator {
    /**
     * The `contains` operator.
     */
    Contains = "contains",
    /**
     * The `doesnotcontain` operator.
     */
    DoesNotContain = "doesnotcontain",
    /**
     * The `doesnotendwith` operator.
     */
    DoesNotEndWith = "doesnotendwith",
    /**
     * The `doesnotstartwith` operator.
     */
    DoesNotStartWith = "doesnotstartwith",
    /**
     * The `endswith` operator.
     */
    EndsWith = "endswith",
    /**
     * The `eq` operator.
     */
    EqualTo = "eq",
    /**
     * The `gt` operator.
     */
    GreaterThan = "gt",
    /**
     * The `gte` operator.
     */
    GreaterThanOrEqual = "gte",
    /**
     * The `isempty` operator.
     */
    IsEmpty = "isempty",
    /**
     * The `isnotempty` operator.
     */
    IsNotEmpty = "isnotempty",
    /**
     * The `isnotnull` operator.
     */
    IsNotNull = "isnotnull",
    /**
     * The `isnull` operator.
     */
    IsNull = "isnull",
    /**
     * The `lt` operator.
     */
    LessThan = "lt",
    /**
     * The `lte` operator.
     */
    LessThanOrEqual = "lte",
    /**
     * The `neq` operator.
     */
    NotEqualTo = "neq",
    /**
     * The `startswith` operator.
     */
    StartsWith = "startswith"
}