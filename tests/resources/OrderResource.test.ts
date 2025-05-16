import { OrderResource } from "../../src/resources/OrderResource";
import { mockOrderAggregateResult } from "../mocks/mockOrder";

describe("OrderResource - toResponse ", () => {
  it("should transform single order to response format", () => {
    const response = OrderResource.toResponse(mockOrderAggregateResult);

    expect(response).toEqual(mockOrderAggregateResult);
  });
});

describe("OrderResource - toCollection ", () => {
  it("should transform multiple orders using toCollection", () => {
    const response = OrderResource.toCollection([mockOrderAggregateResult]);

    expect(response).toEqual([mockOrderAggregateResult]);
  });
});
