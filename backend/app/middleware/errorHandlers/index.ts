import badRequestHandler from "./badRequest"
import defaultHandler from "./default"
const errorHandlers = [
    badRequestHandler,
    defaultHandler // must be last
]

export default errorHandlers