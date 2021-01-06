package devlounge.spring.service;

import java.util.List;

import devlounge.spring.model.HotelSpecial;

public interface HotelSpecialService {

	public List<HotelSpecial> findAll();
	public HotelSpecial findById(int id);
	
}
