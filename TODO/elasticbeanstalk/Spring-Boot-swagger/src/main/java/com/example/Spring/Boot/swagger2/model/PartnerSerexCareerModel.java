package com.example.Spring.Boot.swagger2.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
@Entity
@Table(name = "PARTNER_SEREX_CAREER")
public class PartnerSerexCareerModel implements Serializable {

	private static final long serialVersionUID = 4255304654395046232L;

	/**
	 * Attribute partnerSerexCareerId.
	 */
    @Id
    @Column(name = "PARTNER_SEREX_CAREER_ID")
	private Long partnerSerexCareerId;
	
	/**
	 * Attribute parcode.
	 */
	@Column private String parcode;
	
	/**
	 * Attribute paraccount.
	 */
	@Column private String paraccount;
	
	/**
	 * Attribute parname.
	 */
	@Column private String parname;
	
	/**
	 * Attribute parnick.
	 */
	@Column private String parnick;
	
	/**
	 * Attribute paremail.
	 */
	@Column private String paremail;
	
	/**
	 * Attribute paraddress.
	 */
	@Column private String paraddress;
	
	/**
	 * Attribute parphone.
	 */
	@Column private String parphone;
	
	/**
	 * Attribute partranname.
	 */
	@Column private String partranname;
	
	/**
	 * Attribute parcareercode.
	 */
	@Column private String parcareercode;
	
	/**
	 * Attribute partemplatecode.
	 */
	@Column private String partemplatecode;
	
	/**
	 * Attribute parlicense.
	 */
	@Column private String parlicense;
	
	/**
	 * Attribute pardatecreate.
	 */
	@Column private String pardatecreate;
	
	/**
	 * Attribute parservicename.
	 */
	@Column private String parservicename;
	
	/**
	 * Attribute parcustkeycolumn.
	 */
	@Column private String parcustkeycolumn;
	
	/**
	 * Attribute parcustid.
	 */
	@Column private String parcustid;
	
	/**
	 * Attribute paraccesskey.
	 */
	@Column private String paraccesskey;
	
	/**
	 * Attribute parsecretkey.
	 */
	@Column private String parsecretkey;
	
	/**
	 * Attribute protocol.
	 */
	@Column private String protocol;
	
	/**
	 * Attribute webservice.
	 */
	@Column private String webservice;
	
	/**
	 * Attribute parfax.
	 */
	@Column private String parfax;
	
	/**
	 * Attribute parid.
	 */
	@Column private Long parid;
	
	/**
	 * Attribute serexid.
	 */
	@Column private Long serexid;
	
	/**
	 * Attribute parprefix.
	 */
	@Column private String parprefix;
	
	/**
	 * Attribute empid.
	 */
	@Column private String empid;
	
	/**
	 * Attribute status.
	 */
	@Column private String status;
	
	/**
	 * Attribute feeStatus.
	 */
	@Column private String feeStatus;
	
	/**
	 * Attribute bankname.
	 */
	@Column private String bankname;
	
	/**
	 * Attribute branchname.
	 */
	@Column private String branchname;
	
	/**
	 * Attribute cityname.
	 */
	@Column private String cityname;
	
	/**
	 * Attribute partype.
	 */
	@Column private String partype;
	
	/**
	 * Attribute bankcode.
	 */
	@Column private String bankcode;
	
	/**
	 * Attribute bankId.
	 */
	@Column private String bankId;
	
	/**
	 * Attribute productId.
	 */
	@Column private String productId;
	
	/**
	 * Attribute provineid.
	 */
	@Column private String provineid;
	
	/**
	 * Attribute directBankcode.
	 */
	@Column private String directBankcode;
	
	/**
	 * Attribute emailsms.
	 */
	@Column private String emailsms;
	
	/**
	 * Attribute timeReloading.
	 */
	@Column private Long timeReloading;
	
	/**
	 * Attribute serbilltype.
	 */
	@Column private String serbilltype;
	
	 /** Attribute description.
	 */
	@Column private String description;
	
	 /** Attribute cardRemarks.
		 */
	@Column (name = "CARDREMARKS")
	private String cardRemarks;
	
	/** Attribute isRevert.
	 */
	@Column (name="ISREVERT")
	private String isRevert;
	
	@Column (name="IS_CONFIRM")
	private String isConfirm;
	
	@Transient 
	private String paybillResult;

	/**
	 * @return partnerSerexCareerId
	 */
	public Long getPartnerSerexCareerId() {
		return partnerSerexCareerId;
	}

	/**
	 * @param partnerSerexCareerId new value for partnerSerexCareerId 
	 */
	public void setPartnerSerexCareerId(Long partnerSerexCareerId) {
		this.partnerSerexCareerId = partnerSerexCareerId;
	}
	
	/**
	 * @return parcode
	 */
	public String getParcode() {
		return parcode;
	}

	/**
	 * @param parcode new value for parcode 
	 */
	public void setParcode(String parcode) {
		this.parcode = parcode;
	}
	
	/**
	 * @return paraccount
	 */
	public String getParaccount() {
		return paraccount;
	}

	/**
	 * @param paraccount new value for paraccount 
	 */
	public void setParaccount(String paraccount) {
		this.paraccount = paraccount;
	}
	
	/**
	 * @return parname
	 */
	public String getParname() {
		return parname;
	}

	/**
	 * @param parname new value for parname 
	 */
	public void setParname(String parname) {
		this.parname = parname;
	}
	
	/**
	 * @return parnick
	 */
	public String getParnick() {
		return parnick;
	}

	/**
	 * @param parnick new value for parnick 
	 */
	public void setParnick(String parnick) {
		this.parnick = parnick;
	}
	
	/**
	 * @return paremail
	 */
	public String getParemail() {
		return paremail;
	}

	/**
	 * @param paremail new value for paremail 
	 */
	public void setParemail(String paremail) {
		this.paremail = paremail;
	}
	
	/**
	 * @return paraddress
	 */
	public String getParaddress() {
		return paraddress;
	}

	/**
	 * @param paraddress new value for paraddress 
	 */
	public void setParaddress(String paraddress) {
		this.paraddress = paraddress;
	}
	
	/**
	 * @return parphone
	 */
	public String getParphone() {
		return parphone;
	}

	/**
	 * @param parphone new value for parphone 
	 */
	public void setParphone(String parphone) {
		this.parphone = parphone;
	}
	
	/**
	 * @return partranname
	 */
	public String getPartranname() {
		return partranname;
	}

	/**
	 * @param partranname new value for partranname 
	 */
	public void setPartranname(String partranname) {
		this.partranname = partranname;
	}
	
	/**
	 * @return parcareercode
	 */
	public String getParcareercode() {
		return parcareercode;
	}

	/**
	 * @param parcareercode new value for parcareercode 
	 */
	public void setParcareercode(String parcareercode) {
		this.parcareercode = parcareercode;
	}
	
	/**
	 * @return partemplatecode
	 */
	public String getPartemplatecode() {
		return partemplatecode;
	}

	/**
	 * @param partemplatecode new value for partemplatecode 
	 */
	public void setPartemplatecode(String partemplatecode) {
		this.partemplatecode = partemplatecode;
	}
	
	/**
	 * @return parlicense
	 */
	public String getParlicense() {
		return parlicense;
	}

	/**
	 * @param parlicense new value for parlicense 
	 */
	public void setParlicense(String parlicense) {
		this.parlicense = parlicense;
	}
	
	/**
	 * @return pardatecreate
	 */
	public String getPardatecreate() {
		return pardatecreate;
	}

	/**
	 * @param pardatecreate new value for pardatecreate 
	 */
	public void setPardatecreate(String pardatecreate) {
		this.pardatecreate = pardatecreate;
	}
	
	/**
	 * @return parservicename
	 */
	public String getParservicename() {
		return parservicename;
	}

	/**
	 * @param parservicename new value for parservicename 
	 */
	public void setParservicename(String parservicename) {
		this.parservicename = parservicename;
	}
	
	/**
	 * @return parcustkeycolumn
	 */
	public String getParcustkeycolumn() {
		return parcustkeycolumn;
	}

	/**
	 * @param parcustkeycolumn new value for parcustkeycolumn 
	 */
	public void setParcustkeycolumn(String parcustkeycolumn) {
		this.parcustkeycolumn = parcustkeycolumn;
	}
	
	/**
	 * @return parcustid
	 */
	public String getParcustid() {
		return parcustid;
	}

	/**
	 * @param parcustid new value for parcustid 
	 */
	public void setParcustid(String parcustid) {
		this.parcustid = parcustid;
	}
	
	/**
	 * @return paraccesskey
	 */
	public String getParaccesskey() {
		return paraccesskey;
	}

	/**
	 * @param paraccesskey new value for paraccesskey 
	 */
	public void setParaccesskey(String paraccesskey) {
		this.paraccesskey = paraccesskey;
	}
	
	/**
	 * @return parsecretkey
	 */
	public String getParsecretkey() {
		return parsecretkey;
	}

	/**
	 * @param parsecretkey new value for parsecretkey 
	 */
	public void setParsecretkey(String parsecretkey) {
		this.parsecretkey = parsecretkey;
	}
	
	/**
	 * @return protocol
	 */
	public String getProtocol() {
		return protocol;
	}

	/**
	 * @param protocol new value for protocol 
	 */
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	
	/**
	 * @return webservice
	 */
	public String getWebservice() {
		return webservice;
	}

	/**
	 * @param webservice new value for webservice 
	 */
	public void setWebservice(String webservice) {
		this.webservice = webservice;
	}
	
	/**
	 * @return parfax
	 */
	public String getParfax() {
		return parfax;
	}

	/**
	 * @param parfax new value for parfax 
	 */
	public void setParfax(String parfax) {
		this.parfax = parfax;
	}
	
	/**
	 * @return parid
	 */
	public Long getParid() {
		return parid;
	}

	/**
	 * @param parid new value for parid 
	 */
	public void setParid(Long parid) {
		this.parid = parid;
	}
	
	/**
	 * @return serexid
	 */
	public Long getSerexid() {
		return serexid;
	}

	/**
	 * @param serexid new value for serexid 
	 */
	public void setSerexid(Long serexid) {
		this.serexid = serexid;
	}
	
	/**
	 * @return parprefix
	 */
	public String getParprefix() {
		return parprefix;
	}

	/**
	 * @param parprefix new value for parprefix 
	 */
	public void setParprefix(String parprefix) {
		this.parprefix = parprefix;
	}
	
	/**
	 * @return empid
	 */
	public String getEmpid() {
		return empid;
	}

	/**
	 * @param empid new value for empid 
	 */
	public void setEmpid(String empid) {
		this.empid = empid;
	}
	
	/**
	 * @return status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * @param status new value for status 
	 */
	public void setStatus(String status) {
		this.status = status;
	}
	
	/**
	 * @return feeStatus
	 */
	public String getFeeStatus() {
		return feeStatus;
	}

	/**
	 * @param feeStatus new value for feeStatus 
	 */
	public void setFeeStatus(String feeStatus) {
		this.feeStatus = feeStatus;
	}
	
	/**
	 * @return bankname
	 */
	public String getBankname() {
		return bankname;
	}

	/**
	 * @param bankname new value for bankname 
	 */
	public void setBankname(String bankname) {
		this.bankname = bankname;
	}
	
	/**
	 * @return branchname
	 */
	public String getBranchname() {
		return branchname;
	}

	/**
	 * @param branchname new value for branchname 
	 */
	public void setBranchname(String branchname) {
		this.branchname = branchname;
	}
	
	/**
	 * @return cityname
	 */
	public String getCityname() {
		return cityname;
	}

	/**
	 * @param cityname new value for cityname 
	 */
	public void setCityname(String cityname) {
		this.cityname = cityname;
	}
	
	/**
	 * @return partype
	 */
	public String getPartype() {
		return partype;
	}

	/**
	 * @param partype new value for partype 
	 */
	public void setPartype(String partype) {
		this.partype = partype;
	}
	
	/**
	 * @return bankcode
	 */
	public String getBankcode() {
		return bankcode;
	}

	/**
	 * @param bankcode new value for bankcode 
	 */
	public void setBankcode(String bankcode) {
		this.bankcode = bankcode;
	}
	
	/**
	 * @return bankId
	 */
	public String getBankId() {
		return bankId;
	}

	/**
	 * @param bankId new value for bankId 
	 */
	public void setBankId(String bankId) {
		this.bankId = bankId;
	}
	
	/**
	 * @return productId
	 */
	public String getProductId() {
		return productId;
	}

	/**
	 * @param productId new value for productId 
	 */
	public void setProductId(String productId) {
		this.productId = productId;
	}
	
	/**
	 * @return provineid
	 */
	public String getProvineid() {
		return provineid;
	}

	/**
	 * @param provineid new value for provineid 
	 */
	public void setProvineid(String provineid) {
		this.provineid = provineid;
	}
	
	/**
	 * @return directBankcode
	 */
	public String getDirectBankcode() {
		return directBankcode;
	}

	/**
	 * @param directBankcode new value for directBankcode 
	 */
	public void setDirectBankcode(String directBankcode) {
		this.directBankcode = directBankcode;
	}
	
	/**
	 * @return emailsms
	 */
	public String getEmailsms() {
		return emailsms;
	}

	/**
	 * @param emailsms new value for emailsms 
	 */
	public void setEmailsms(String emailsms) {
		this.emailsms = emailsms;
	}
	
	/**
	 * @return timeReloading
	 */
	public Long getTimeReloading() {
		return timeReloading;
	}

	/**
	 * @param timeReloading new value for timeReloading 
	 */
	public void setTimeReloading(Long timeReloading) {
		this.timeReloading = timeReloading;
	}
	
	/**
	 * @return serbilltype
	 */
	public String getSerbilltype() {
		return serbilltype;
	}

	/**
	 * @param serbilltype new value for serbilltype 
	 */
	public void setSerbilltype(String serbilltype) {
		this.serbilltype = serbilltype;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCardRemarks() {
		return cardRemarks;
	}

	public void setCardRemarks(String cardRemarks) {
		this.cardRemarks = cardRemarks;
	}

	public String getIsRevert() {
		return isRevert;
	}

	public void setIsRevert(String isRevert) {
		this.isRevert = isRevert;
	}

	public String getPaybillResult() {
		return paybillResult;
	}

	public void setPaybillResult(String paybillResult) {
		this.paybillResult = paybillResult;
	}

	public String getIsConfirm() {
		return isConfirm;
	}

	public void setIsConfirm(String isConfirm) {
		this.isConfirm = isConfirm;
	}	
	
	
}