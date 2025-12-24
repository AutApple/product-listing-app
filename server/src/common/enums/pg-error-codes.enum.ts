export enum PostgresErrorCodes {
  
    UniqueViolation = '23505',        // conflict on unique constraint
    ForeignKeyViolation = '23503',    // foreign key constraint violation
    NotNullViolation = '23502',       // NOT NULL constraint violation
    CheckViolation = '23514',         // CHECK constraint violation
    ExclusionViolation = '23P01',     // EXCLUSION constraint violation

   
    StringDataRightTruncation = '22001',          // value too long for column
    InvalidTextRepresentation = '22P02',         // invalid input, e.g., string to int
    NumericValueOutOfRange = '22003',            // numeric overflow
    NullValueNoIndicatorParameter = '22004',     // null value where not allowed
    InvalidDatetimeFormat = '22007',             // invalid datetime format
    InvalidDatetimeField = '22008',              // datetime field out of range

   
    SyntaxError = '42601',        // SQL syntax error
    UndefinedColumn = '42703',    // column does not exist
    UndefinedTable = '42P01',     // table does not exist
    UndefinedFunction = '42883',  // function does not exist
}