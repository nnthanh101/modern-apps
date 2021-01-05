package devlounge.spring.dao;

import java.util.Date;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import devlounge.spring.model.HotelSpecial;

@Repository
public class HotelSpecialDAOImpl implements HotelSpecialDAO {
	
	private static final Logger logger = LoggerFactory.getLogger(HotelSpecialDAOImpl.class);

	private SessionFactory sessionFactory;
	
	public void setSessionFactory(SessionFactory sf){
		this.sessionFactory = sf;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<HotelSpecial> findAll() {
		Date now = new Date();		
		Session session = this.sessionFactory.getCurrentSession();
		List<HotelSpecial> itemList = session.createQuery("from HotelSpecial where expiryDate > " + now.getTime() + " order by expiryDate").list();
		for(HotelSpecial item : itemList){
			logger.info("Item::"+ item);
		}
		return itemList;
	}

	@Override
	public HotelSpecial findById(int id) {
		Session session = this.sessionFactory.getCurrentSession();		
		HotelSpecial item = (HotelSpecial) session.load(HotelSpecial.class, new Integer(id));
		logger.info("Item loaded successfully, details=" + item);
		return item;
	}
}
