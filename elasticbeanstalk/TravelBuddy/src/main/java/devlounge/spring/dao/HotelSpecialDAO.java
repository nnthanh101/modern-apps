package devlounge.spring.dao;

import java.util.List;

import devlounge.spring.model.HotelSpecial;

public interface HotelSpecialDAO {

	public List<HotelSpecial> findAll();
	public HotelSpecial findById(int id);
}
