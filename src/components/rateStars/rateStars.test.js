import React from "react";
import RateStars from "./rateStars";
import { shallow, mount } from "enzyme";

describe("Testing RateStars component", () => {
	it("renders with 5 stars without crashing", () => {
		let component = shallow(<RateStars />);
		expect(component.find(".item")).toHaveLength(5);
		component.unmount();
	});

	it("should return data-id on click", () => {
		let value = 0;
		let callback = (rate) => {
			value = rate
		};

		let component = mount(<RateStars callback={callback} />);

		component.find(".item").forEach((item, index) => {
			item.simulate("click");
			expect(value).toBe(+item.prop("data-id"));
		});
		
		component.unmount();
	})
})