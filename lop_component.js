let classMitra = {};
let project = [];

function MakeQuerablePromise(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isResolved) return promise;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function(v) {
            isFulfilled = true;
            isPending = false;
            return v; 
        }, 
        function(e) {
            isRejected = true;
            isPending = false;
            throw e; 
        }
    );

    result.isFulfilled = function() { return isFulfilled; };
    result.isPending = function() { return isPending; };
    result.isRejected = function() { return isRejected; };
    return result;
}

class ComponentLOP {

	constructor(type, category) {
		
		if (type == "EST TAHUN WIN")
			return new TahunWin(category);
		else if (type == "EST BULAN WIN")
			return new BulanWin
		else if (type == "AREA SCAL")
			return new Scaling(type, category);
		else if (type == "VALID SCAL")
			return new Scaling(type, category);
		else if (type == "AREA TOP")
			return new TermOfPay(category);
		else if (type == "CALCULATE TOP")
			return new CalcAdpNProject(category);
		else if(type == "GET DATA")
			return new ActionData(category);
		else if(type == "ADD ELEMENTS")
			return new AddComponents(category);
		else if(type == "SPLITING")
			return new Spliting(category);
		else if(type == "MODIFY INPUT")
			return new ModifyInput(category);
		else if(type == "ENTITAS INPUT")
			return new EntitasInput(category);
		else if (type == "MAPPING PRODUCT") 
			return new MappingProduct(category);
			
	}

}


class Mitra {
  constructor(data) {
    if (Mitra.exists) {
      return Mitra.instance;
    }
    this._data = data;
    Mitra.instance = this;
    Mitra.exists = true;
    return this;
  }

  getData() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }

}

class Project {

	// constructor(){
	// 	this.project = (id_project, project, nilai_project, nipnas, est_bulan_close, tipe_project, sub_type_project, est_bulan_close, term_of_pay, otc, rec, satuan_base, volume_base, termins, shared_sustain, menggunkan_mitra, menngunkan_layanan, use_sbr, last_status, progress_lesson, reason_lose, lama_kontrak, est_nilai_1, est_nilai_2, est_nilai_3, est_nilai_4, est_nilai_5, est_nilai_6, klasifikasi_layanan, nama_pelanggan_doc, kategori_product, kategori_lop, level_confidence, est_gross_profit, kategori_kontrak, support_needed, approch_by, kompetitor, jenis_pengadaan, file_spk, no_spk_cc) => {

	// 	}
	// }
}

class LoadProject {
	constructor(id_project){
		let DataProject = new ActionData("PROJECT");
		let getData 	= DataProject.getDataByParams("PROJECT", id_project);
		this.list_project = getData.project;
	}
}

/* Action Get Data */
	class ActionData {
		
		constructor(type) {
			if(type == "KATEGORI PRODUK"){
				let product = [];
				$.ajax({
					url: `${url_base}index.php/tools/getKatgeoriProduct`,
					type: 'GET',
					async: false,
					success: function (data) {
						product = JSON.parse(data);
					},
				});
				this.listproduct = product;
			}else if (type == "STATUS LOP") {
				let status = [];
				$.ajax({
					url: `${url_base}index.php/tools/getStatusLOP`,
					type: 'GET',
					async: false,
					success: function (data) {
						status = JSON.parse(data);
					},
				});
				this.liststatus = status;
			}else if (type == "MITRA") {
				let mitra = [];
				$.ajax({
					url: `${url_base}index.php/tools/getListMitra`,
					type: 'GET',
					async: false,
					success: function (data) {
						mitra = JSON.parse(data);
					},
				});
				this.list_mitra = mitra;
			}else if(type == "KLASIFIKASI PENGADAAN"){
				let pengadaan = [];
				$.ajax({
					url: `${url_base}index.php/tools/getKlasifikasiPengadaan`,
					type: 'GET',
					async: false,
					success: function (data) {
						pengadaan = JSON.parse(data);
					},
				});
				this.list_pengadaan = pengadaan;		
			}
			else{
				this.listlesson = [];
				this.getDataByParams = (type, param) => {
					switch (type) {
						case 'LESSON LEARNED':
							let lesson = [];
							$.ajax({
								url: `${url_base}index.php/tools/getLessonLearned/${param}`,
								type: 'GET',
								async: false,
								success: function (data) {
									lesson = JSON.parse(data);
								},
							});
							this.listlesson = lesson;
							let areaLesson = `<option value="" selected disabled>Pilih Tahapan Project</option>`;
							if(param == "WIN" || param == "CANCEL" || param == "LOSE"){
								areaLesson = `<option value="" selected disabled>Pilih Lesson Learned</option>`;
								this.listlesson.map((val) => {
									areaLesson += `<option value="${val.toUpperCase()}">${val}</option>`;
								});
							}else {
								this.listlesson.map((val) => {
									areaLesson += `<option value="${val}">${val}</option>`;
								});
							}
							$("#progress").html(areaLesson);
							break;
						case `PROJECT`:
							let projects = [];
							$.ajax({
								url: `${url_base}index.php/tools/getDetailLop/${param}`,
								type: 'GET',
								async: false,
								success: function (data) {
									project = JSON.parse(data);
								},
							});
							this.project = projects;
						break;
						case `PROJECT MITRA`:
							let mitras = [];
							$.ajax({
								url: `${url_base}index.php/tools/getDetailMitra/${param}`,
								type: 'GET',
								async: false,
								success: function (data) {
									mitras = JSON.parse(data);
								},
							});
							
							let promProjMit = new Promise(function(resolve, reject) {
							  resolve(mitras);
							 
							  reject(new Error(`Not Loaded List Mitra Project`));
							});

							promProjMit.then((val) => {
								this.mitraproj = val;
							});

						break;
						case `SCORING PROJECT`: 
							let datascore = [];
							$.ajax({
								url: `${url_base}index.php/tools/getScoreSubmitted/${param}`,
								type: 'GET',
								async: false,
								success: function (data) {
									datascore = JSON.parse(data);
								},
							});

							let promProScore = new Promise(function(resolve, reject) {
							  resolve(datascore);
							  
							  reject(new Error(`Not Loaded List Score Project`));
							});


							promProScore.then((val) => {

								console.log(val);
								return val;
							});
						
						break;
						case 'CC PROFILING' : 
							$.ajax({
								url: `${url_base}index.php/assesment/profiling/getProfileCC/${param}`,
								type: 'GET',
								success: function (res) {
									let detail = JSON.parse(res);
									let color = `default`;
									if(detail[0].CUST_PROFILING == 'LOW RISK')
										color = `success`;
									else if(detail[0].CUST_PROFILING == 'MEDIUM RISK')
										color = `warning`;
									else if(detail[0].CUST_PROFILING == 'HIGH RISK')
										color = `danger`;

									let colorcc = (detail[0].UMUR_CC == "> 2 TH" || detail[0].UMUR_CC == "> 2TH") ? "info" : "danger";
									
									let colorcr = "danger";
									if(detail[0].CR >= 80 && detail[0].CR < 95)
										colorcr = "warning";
									else if(detail[0].CR >= 95)
										colorcr = "info";

									let html = `<ul class="list-group">
												  <li class="list-group-item row">
												    <span class="col-sm-4">Umur CC</span>
												   	<div class="col-sm-8">
												    	<span class="badge label label-${colorcc}">${detail[0].UMUR_CC}</span>
												   	</div>
												  </li>

												  <li class="list-group-item row">
												  	<span class="col-sm-4">Avg Rev/Bln</span>
												  	<div class="col-sm-8">
												    	<span class="badge label label-info">${(detail[0].REV_6_BLN/1000000000).toFixed(2)} M</span>
												    </div>
												  </li>

												  <li class="list-group-item row">
												    <span class="col-sm-4">Historis CR</span>
												    <div class="col-sm-8">
												    	<span class="badge label label-${colorcr}">${detail[0].CR ? detail[0].CR+' %' : 'Tidak Ada'}</span>
												  	</div>
												  </li>

												  <li class="list-group-item row">
												  	<span class="col-sm-4">Umur Piutang Terlama</span>
												  	<div class="col-sm-8">
												    	<span class="badge label label-info">${detail[0].UMUR_MIN_TGK ? detail[0].UMUR_MIN_TGK+' Bulan' : 'Tidak Ada'}</span>
												  	</div>
												  </li>

												  <li class="list-group-item row">
												    <span class="col-sm-4">Result Profiling</span>
												    <div class="col-sm-8">
													    <span class="badge label label-${color}">
															${detail[0].CUST_PROFILING}
														</span>
													</div>
												  </li>
												</ul>
												`;
									$("#profilingCC").html(html);
								}
							});
						break;
						default:
							// statements_def
							break;
					}
				}
			}
		}

	}

	class getDataForAsync {
		constructor(type){
			if(type == "LIST MITRA"){
				this.list_mitra = [];

				const listMitra = new Mitra(this.list_mitra);
				let mitras = listMitra.getData();

				if(mitras.length > 0){
					this.list_mitra = mitras;
				}else{
					let promMitra = new Promise(function(resolve, reject) {
					  resolve(new ComponentLOP("GET DATA", "MITRA"));
					 
					  reject(new Error(`Not Loaded List Mitra`));
					});

					promMitra.then((val) => {
						const listMitra = new Mitra(val.list_mitra);
						let mitras = listMitra.getData();
						this.list_mitra = val.list_mitra;
					});
				}
				
			}
		}
	}
/* End Action Get Data */


/* Component when append html */
	class AddComponents {
		constructor(type) {
			
			switch (type) {
				case `TERMIN`:{
					this.addTermins = (index) => {
						let html = `<div class="form-group frmZebraTermin">
										<label class="col-sm-3 control-label">Termin Ke-${index}</label>
										<div class="col-sm-3">
											<input type="hidden" name="indexTermin[]" class="indexTermin" value="${indexTermin}">
											<input type="text" name="valTermin[]" placeholder="Input Nilai Termin (Rp)" id="Termin${index}" data-top="TmpTermin${index}" class="form-control terminInput currency" required>
											<input type="hidden" name="tmpTermin[]" id="TmpTermin${index}" class="tmpTermin" >
										</div>
										<div class="col-sm-3 dateTermin">
											<input type="text" name="tgl_termin[]" id="periodeTermin${index}" class="form-control terminDate periodTermin" placeholder="Input Bulan" required>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" class="btn btn-danger btn-sm btnMoveTermin" data-id="${indexTermin}">Hapus</button>
										</div>
									</div>`;
						return html;
					}
					break;
				}case `LAYANAN`: {
					this.addLayanan = (index) => {
						return `<div class="formLayanan frmZebraLayanan" data-id-layanan="${index}">
									<div class="form-group">	
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-2">
											<select name="nama_layanan_telkom[]" id="jenislatel${index}" required class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-2 titleLyn">
											<input type="text" name="txt_layanan_telkom[]" id="latel${index}" class="form-control name_layanan_telkom" placeholder="Layanan" required>
										</div>
										<div class="col-sm-3">
											<div class="input-group">
											 <span class="input-group-addon addon-blue-jeans">Rp</span>
											 <input type="text" name="share_layanan[]" id="share_layanan${index}" data-top="share_layanan_tmp${index}" class="col-sm-2 form-control share_layanan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
											 <input type="hidden" name="share_layanan_tmp[]" class="tmpsharelayanan" id="share_layanan_tmp${index}" />
											</div>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" class="btnMovelayanan btn btn-danger btn-sm">Hapus</button>
										</div>
									</div>
									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi[]" required class="form-control" id="jum_lokasi${index}" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr[]" id="used_sbr${index}" class="used_sbr" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon[]" id="diskon${index}" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
					}
					break;
				}case `MITRA`: {
					this.areaMitra = (index) => {
						let options;
						classMitra.getData().map((val, key) => {
							options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
						});
						return `<div class="form-group formMitras frmZebra">
										<label class="col-sm-3 control-label"></label>
										<div class="col-sm-2 ayam">
											<select name="nama_mitra[]" data-id="${index}" id="Mitra${index}" class="form-control select2form selMit" required>
												<option value="" selected disabled>Rekomendasi Mitra</option>'
												${options}
											</select>
											<div class="clearfix" style="margin-bottom:10px;"></div>
											<input type="hidden" name="other[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control ${index}" id="otherMitra${index}" />
										</div>
										<div class="col-sm-2">
											<input type="text" name="layanan[]" class="form-control" placeholder="Layanan" id="layananMit${index}" required>
										</div>
										<div class="col-sm-3">
											<div class="input-group" id="mitra${index}">
											  <span class="input-group-addon addon-blue-jeans">Rp</span>
											  <input type="text" name="share_anak_perusahaan[]" id="share_anak_perusahaan${index}" data-top="share_anak_perusahaan_tmp${index}" class="col-sm-2 form-control share_anak_perusahaan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
											  <input type="hidden" name="share_anak_perusahaan_tmp[]" class="tmpshare" id="share_anak_perusahaan_tmp${index}"  />
											</div>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button"  class="btn btn-danger btn-sm delAddMitra">Hapus</button>
										</div>
										<div class="row">
											<div class="col-sm-12">
												<div class="col-sm-9 col-sm-push-3">
													<span style="color: red;" class="help-block">
														*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
													</span>
												</div>
											</div>
										</div>
									</div>`;
					
					};
					
					break;
				}case `LAYANAN EDIT`: {
					this.addLayanan = (index) => {
						return `<div class="formLayanan frmZebraLayanan" data-id-layanan="${index}">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-2">
											<select name="nama_layanan_telkom_edit[]" id="jenislatel${index}" required class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-2 titleLyn">
											<input type="text" name="txt_layanan_telkom_edit[]" id="latel${index}" class="form-control name_layanan_telkom" placeholder="Layanan" required>
										</div>
										<div class="col-sm-3">
											<div class="input-group">
											 <span class="input-group-addon addon-blue-jeans">Rp</span>
											 <input type="text" name="share_layanan_edit[]" id="share_layanan${index}" data-top="share_layanan_tmp${index}" class="col-sm-2 form-control share_layanan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
											 <input type="hidden" name="share_layanan_edit_tmp[]" class="tmpsharelayanan" id="share_layanan_tmp${index}" />
											</div>
										</div>

										<input type="hidden" name="idLayanan_edit[]" id="idLayanan_edit${index}" />

										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" class="btnMovelayanan btn btn-danger btn-sm">Hapus</button>
										</div>
									</div>

									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi_edit[]" class="form-control" id="jum_lokasi${index}" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr_edit[]" id="used_sbr${index}" class="used_sbr" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon_edit[]" id="diskon${index}" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
					}
					break;
				}case `MITRA EDIT`: {
					this.areaMitra = (index) => {
						let options;
						classMitra.getData().map((val, key) => {
							options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
						});
						return `<div class="form-group formMitras frmZebra">
										<label class="col-sm-3 control-label"></label>
										<div class="col-sm-2 ayam mitra-opt-${index}">
											<select name="nama_mitra_edit[]" data-id="${index}" id="Mitra${index}" class="form-control select2form selMit" required>
												<option value="" selected disabled>Rekomendasi Mitra</option>'
												${options}
											</select>
											<div class="clearfix" style="margin-bottom:10px;"></div>
											<input type="hidden" name="other_edit[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control ${index}" id="otherMitra${index}" />
										</div>
										<div class="col-sm-2">
											<input type="text" name="layanan_edit[]" class="form-control" placeholder="Layanan" id="layananMit${index}" required>
										</div>
										<div class="col-sm-3">
											<div class="input-group" id="mitra${index}">
											  <span class="input-group-addon addon-blue-jeans">Rp</span>
											  <input type="text" name="share_anak_perusahaan_edit[]" id="share_anak_perusahaan${index}" data-top="share_anak_perusahaan_tmp${index}" class="col-sm-2 form-control share_anak_perusahaan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
											  <input type="hidden" name="share_anak_perusahaan_edit_tmp[]" class="tmpshare" id="share_anak_perusahaan_tmp${index}"  />
											</div>
										</div>

										<input type="hidden" name="idPm[]" id="idPm${index}" />

										<div class="col-sm-1 btn-delmit-${index}" style="padding-left:0;">
											<button type="button"  class="btn btn-danger btn-sm delAddMitra">Hapus</button>
										</div>
										<div class="row">
											<div class="col-sm-12">
												<div class="col-sm-9 col-sm-push-3">
													<span style="color: red;" class="help-block">
														*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
													</span>
												</div>
											</div>
										</div>
									</div>`;
					
					};
					
					break;
				}case 'MITRA LOP' : {
					this.areaMitra = (index) => {
						let options;
						classMitra.getData().map((val, key) => {
							options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
						});
						return `<div class="form-group formMitras frmZebra">
										<label class="col-sm-3 control-label"></label>
										<div class="col-sm-3 ayam">
											<select name="nama_mitra[]" data-id="${index}" id="Mitra${index}" class="form-control select2form selMit" required>
												<option value="" selected disabled>Rekomendasi Mitra</option>'
												${options}
											</select>
											<div class="clearfix" style="margin-bottom:10px;"></div>
											<input type="hidden" name="other[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control ${index}" id="otherMitra${index}" />
										</div>
										<div class="col-sm-3">
											<input type="text" name="layanan[]" class="form-control" placeholder="Layanan" id="layananMit${index}" required>
										</div>

										<div class="col-sm-2">
											<div class="col-sm-12" id="mitra${index}">
											  <input type="number" name="persen_mitra[]" max="100" min="0" id="persen_mitra${index}" data-top="persen_mitra_tmp${index}" class="col-sm-2 form-control persen_mitra_tmp persen" placeholder="Bobot Layanan" required />
											 <label class="label label-info">%</label>
											  <input type="hidden" name="share_anak_perusahaan_tmp[]" class="tmpshare" id="persen_mitra_tmp${index}"  />
											</div>
										</div>

										<div class="col-sm-1" style="padding-left:0;">
											<button type="button"  class="btn btn-danger btn-sm delAddMitra">Hapus</button>
										</div>
										<div class="row">
											<div class="col-sm-12">
												<div class="col-sm-9 col-sm-push-3">
													<span style="color: red;" class="help-block">
														*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
													</span>
												</div>
											</div>
										</div>
									</div>`;
					
					};
					
					break;
				}case `MITRA LOP EDIT`: {
					this.areaMitra = (index) => {
						let options;
						classMitra.getData().map((val, key) => {
							options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
						});
						return `<div class="form-group formMitras frmZebra">
										<label class="col-sm-3 control-label"></label>
										<div class="col-sm-3 ayam mitra-opt-${index}">
											<select name="nama_mitra_edit[]" data-id="${index}" id="Mitra${index}" class="form-control select2form selMit" required>
												<option value="" selected disabled>Rekomendasi Mitra</option>'
												${options}
											</select>
											<div class="clearfix" style="margin-bottom:10px;"></div>
											<input type="hidden" name="other_edit[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control ${index}" id="otherMitra${index}" />
										</div>
										<div class="col-sm-3">
											<input type="text" name="layanan_edit[]" class="form-control" placeholder="Layanan" id="layananMit${index}" required>
										</div>

										<div class="col-sm-2">
											<div class="col-sm-12" id="mitra${index}">
											  <input type="number" name="persen_mitra[]" max="100" min="0" id="persen_mitra${index}" data-top="persen_mitra_tmp${index}" class="col-sm-2 form-control persen_mitra_tmp persen" placeholder="Bobot Layanan" required />
											 <label class="label label-info">%</label>
											  <input type="hidden" name="share_anak_perusahaan_edit_tmp[]" class="tmpshare" id="persen_mitra_tmp${index}"  />
											</div>
										</div>

										<input type="hidden" name="idPm[]" id="idPm${index}" />

										<div class="col-sm-1 btn-delmit-${index}" style="padding-left:0;">
											<button type="button"  class="btn btn-danger btn-sm delAddMitra">Hapus</button>
										</div>
										<div class="row">
											<div class="col-sm-12">
												<div class="col-sm-9 col-sm-push-3">
													<span style="color: red;" class="help-block">
														*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
													</span>
												</div>
											</div>
										</div>
									</div>`;
					
					};
					
					break;
				}case `LAYANAN LOP`: {
					this.addLayanan = (index) => {
						return `<div class="formLayanan frmZebraLayanan" data-id-layanan="${index}">
									<div class="form-group">	
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-3">
											<select name="nama_layanan_telkom[]" id="jenislatel${index}" required class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-3 titleLyn">
											<input type="text" name="txt_layanan_telkom[]" id="latel${index}" class="form-control name_layanan_telkom" placeholder="Layanan" required>
										</div>
										<div class="col-sm-2">
											<div class="col-sm-12">	
											  <input type="number" max="100" min="0" name="persen_layanan[]" id="persen_layanan${index}" data-top="persen_layanan_tmp${index}" class="col-sm-2 form-control persen_layanan persen" placeholder="Bobot Layanan" required />
											  <label class="label label-info">%</label>
											  <input type="hidden" name="share_layanan_tmp[]" class="tmpsharelayanan" id="persen_layanan_tmp${index}" />
											</div>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" class="btnMovelayanan btn btn-danger btn-sm">Hapus</button>
										</div>
									</div>
									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi[]" required class="form-control" id="jum_lokasi${index}" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr[]" id="used_sbr${index}" class="used_sbr" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon[]" id="diskon${index}" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
					}
					break;
				}case `LAYANAN LOP EDIT`: {
					this.addLayanan = (index) => {
						return `<div class="formLayanan frmZebraLayanan" data-id-layanan="${index}">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-3">
											<select name="nama_layanan_telkom_edit[]" id="jenislatel${index}" required class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-3 titleLyn">
											<input type="text" name="txt_layanan_telkom_edit[]" id="latel${index}" class="form-control name_layanan_telkom"  placeholder="Layanan" required>
										</div>

										<div class="col-sm-2">
											<div class="col-sm-12">	
											  <input type="number" max="100" min="0" name="persen_layanan[]" id="persen_layanan${index}" data-top="persen_layanan_tmp${index}" class="col-sm-2 form-control persen_layanan persen" placeholder="Bobot Layanan" required />
											  <label class="label label-info">%</label>
											  <input type="hidden" name="share_layanan_edit_tmp[]" class="tmpsharelayanan" id="persen_layanan_tmp${index}" />
											</div>
										</div>

										<input type="hidden" name="idLayanan_edit[]" id="idLayanan_edit${index}" />

										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" class="btnMovelayanan btn btn-danger btn-sm">Hapus</button>
										</div>
									</div>

									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi_edit[]" class="form-control" id="jum_lokasi${index}" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr_edit[]" id="used_sbr${index}" class="used_sbr" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon_edit[]" id="diskon${index}" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
					}
					break;
				}case 'SUPPORT NEEDED':
					this.areaSupport = () => {
						return [
						`<div class="form-group">
							<label for="support_need" class="col-sm-3 control-label">Support Needed</label>
							<div class="col-sm-8">
								<textarea name="support_need" id="support_need" class="form-control noresize" placeholder="Support Need" rows="2"></textarea>
							</div>
						</div>`
						];
					}
				break;
				default:{
					
					console.log('Other Comopnents');
					break;
				}
			}
		}
	}

	class ModifyInput {
		constructor (type) {
			if(type == "CURRENCY"){
				this.is_currency = () => {
					return $('.currency').maskNumber({integer: true});
				}
			}else if (type == "MONTH PERIODE") {
				this.is_monthly = (elm) => {
					$(elm).datepicker({
						format: "yyyymm",
					    minViewMode: 1,
					    keyboardNavigation: false,
					    autoclose: true
					});
				}
			}else if (type == "TO NUMBER") {
				this.to_number = (val, elm) => {
					let chNumber = numeral(val);
					var realNum = chNumber.value();
					$(elm).val(realNum);
				}
			}
		}
	}

/* End Component when append html */

/* Classes BA Spliting */
	class Spliting {
		constructor(type){
			if(type == "LAYANAN"){
				this.layanan = `<div class="formLayanan frmZebraLayanan">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-2">
											<select name="nama_layanan_telkom[]" id="jenislatel1" class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-2 titleLyn">
											<input type="text" name="txt_layanan_telkom[]" id="latel1" class="form-control name_layanan_telkom" placeholder="Layanan">
										</div>
										<div class="col-sm-3">
											<div class="input-group">	
											  <span class="input-group-addon addon-blue-jeans">Rp</span>
											  <input type="text" name="share_layanan[]" id="share_layanan1" data-top="share_layanan_tmp1" class="col-sm-2 form-control share_layanan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
											  <input type="hidden" name="share_layanan_tmp[]" class="tmpsharelayanan" id="share_layanan_tmp1" />
											</div>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" id="btnAddlayanan" class="btn btn-primary btn-sm">Tambah</button>
										</div>
									</div>

									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi[]" required class="form-control" id="jum_lokasi1" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr[]" class="used_sbr" id="used_sbr1" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon[]" id="diskon1" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
				
			}else if (type == "MITRA") {
				let options;
				classMitra.getData().map((val, key) => {
					options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
				});

				this.mitras = `<div class="form-group formMitras frmZebra">
							<label  class="col-sm-3 control-label">Usulan Mitra</label>
							<div class="col-sm-2">
								<select name="nama_mitra[]" data-id="0" id="Mitra1" class="form-control select2form selMit" style="width:100%;" required>
									<option value="" selected disabled>Rekomendasi Mitra</option>
									${options}
								</select>
								<div class="clearfix" style="margin-bottom:10px;"></div>
								<input type="hidden" name="other[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control 0" id="otherMitra1" />
							</div>
							<div class="col-sm-2">
								<input type="text" name="layanan[]" class="form-control" placeholder="Layanan" id="layananMit1" required />
							</div>
							<div class="col-sm-3">
								<div class="input-group" id="mitra0">
								  <span class="input-group-addon addon-blue-jeans">Rp</span>
								  <input type="text" name="share_anak_perusahaan[]" id="share_anak_perusahaan1" data-top="share_anak_perusahaan_tmp1" class="col-sm-2 form-control share_anak_perusahaan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
								  <input type="hidden" name="share_anak_perusahaan_tmp[]" id="share_anak_perusahaan_tmp1" class="tmpshare" />
								</div>
							</div>

							<div class="col-sm-1" style="padding-left:0;">
								<button type="button" id="btnAddMitras" class="btn btn-primary btn-sm">Tambah</button>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="col-sm-9 col-sm-push-3">
										<span style="color: red;" class="help-block">
											*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
										</span>
									</div>
								</div>
							</div>
						</div>`;
				
			}else if(type == "LAYANAN EDIT"){
				this.layanan = `<div class="formLayanan frmZebraLayanan">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-2">
											<select name="nama_layanan_telkom_edit[]" id="jenislatel1" class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-2 titleLyn">
											<input type="text" name="txt_layanan_telkom_edit[]" id="latel1" class="form-control name_layanan_telkom" placeholder="Layanan">
										</div>
										<div class="col-sm-3">
											<div class="input-group">	
											  <span class="input-group-addon addon-blue-jeans">Rp</span>
											  <input type="text" name="share_layanan_edit[]" id="share_layanan1" class="col-sm-2 form-control share_layanan currency" data-top="share_layanan_tmp1" placeholder="Nilai BA Spliting (Hanya Angka)" required />
											  <input type="hidden" name="share_layanan_edit_tmp[]" class="tmpsharelayanan" id="share_layanan_tmp1" />
											</div>
										</div>

										<input type="hidden" name="idLayanan_edit[]" id="idLayanan_edit1" />

										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" id="btnAddlayanan" class="btn btn-primary btn-sm">Tambah</button>
										</div>
									</div>

									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi_edit[]" class="form-control" id="jum_lokasi1" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr_edit[]" id="used_sbr1" class="used_sbr" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon_edit[]" id="diskon1" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
				
			}else if (type == "MITRA EDIT") {
				let options;
				classMitra.getData().map((val, key) => {
					options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
				});

				this.mitras = `<div class="form-group formMitras frmZebra">
							<label  class="col-sm-3 control-label">Usulan Mitra</label>
							<div class="col-sm-2 ayam mitra-opt-1">
								<select name="nama_mitra_edit[]" data-id="0" id="Mitra1" class="form-control select2form selMit" style="width:100%;" required>
									<option value="" selected disabled>Rekomendasi Mitra</option>
									${options}
								</select>
								<div class="clearfix" style="margin-bottom:10px;"></div>
								<input type="hidden" name="other_edit[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control 0" id="otherMitra1" />
							</div>
							<div class="col-sm-2">
								<input type="text" name="layanan_edit[]" class="form-control" placeholder="Layanan" id="layananMit1" required />
							</div>
							<div class="col-sm-3">
								<div class="input-group" id="mitra0">
								  <span class="input-group-addon addon-blue-jeans">Rp</span>
								  <input type="text" name="share_anak_perusahaan_edit[]" id="share_anak_perusahaan1" data-top="share_anak_perusahaan_tmp1" class="col-sm-2 form-control share_anak_perusahaan currency" placeholder="Nilai BA Spliting (Hanya Angka)" required />
								  <input type="hidden" name="share_anak_perusahaan_edit_tmp[]" id="share_anak_perusahaan_tmp1" class="tmpshare" />
								</div>
							</div>

							<input type="hidden" name="idPm[]" id="idPm1" />

							<div class="col-sm-1" style="padding-left:0;">
								<button type="button" id="btnAddMitras" class="btn btn-primary btn-sm">Tambah</button>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="col-sm-9 col-sm-push-3">
										<span style="color: red;" class="help-block">
											*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
										</span>
									</div>
								</div>
							</div>
						</div>`;
				
			}else if(type == "LAYANAN LOP"){
				this.layanan = `<div class="formLayanan frmZebraLayanan">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-3">
											<select name="nama_layanan_telkom[]" id="jenislatel1" class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-3 titleLyn">
											<input type="text" name="txt_layanan_telkom[]" id="latel1" class="form-control name_layanan_telkom" placeholder="Layanan">
										</div>
										<div class="col-sm-2">
											<div class="col-sm-12">	
											  <input type="number" max="100" min="0" name="persen_layanan[]" id="persen_layanan1" data-top="persen_layanan_tmp1" class="col-sm-2 form-control persen_layanan persen" placeholder="Bobot Layanan" required />
											  <label class="label label-info">%</label>
											  <input type="hidden" name="share_layanan_tmp[]" class="tmpsharelayanan" id="persen_layanan_tmp1" />
											</div>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" id="btnAddlayanan" class="btn btn-primary btn-sm">Tambah</button>
										</div>
									</div>

									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi[]" required class="form-control" id="jum_lokasi1" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr[]" class="used_sbr" id="used_sbr1" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon[]" id="diskon1" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
				
			}else if(type == "LAYANAN LOP EDIT"){
				this.layanan = `<div class="formLayanan frmZebraLayanan">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-2">
											<select name="nama_layanan_telkom_edit[]" id="jenislatel1" class="form-control lynSel" style="width: 100%;">
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-2 titleLyn">
											<input type="text" name="txt_layanan_telkom_edit[]" id="latel1" class="form-control name_layanan_telkom" placeholder="Layanan">
										</div>
										<div class="col-sm-2">
											<div class="col-sm-12">	
											  <input type="number" max="100" min="0" name="persen_layanan[]" id="persen_layanan1" data-top="persen_layanan_tmp1" class="col-sm-2 form-control persen_layanan persen" placeholder="Bobot Layanan" required />
											  <label class="label label-info">%</label>
											  <input type="hidden" name="share_layanan_edit_tmp[]" class="tmpsharelayanan" id="persen_layanan_tmp1" />
											</div>
										</div>

										<input type="hidden" name="idLayanan_edit[]" id="idLayanan_edit1" />

										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" id="btnAddlayanan" class="btn btn-primary btn-sm">Tambah</button>
										</div>
									</div>

									<div class="form-group">
										<label for="lokasi" class="col-sm-3 control-label">Est Maks Lokasi</label>
										<div class="col-sm-2">
											<input type="number" name="jum_lokasi_edit[]" class="form-control" id="jum_lokasi1" />
										</div>
									</div>
									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr_edit[]" id="used_sbr1" class="used_sbr" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon_edit[]" id="diskon1" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>`;
				
			}else if (type == "MITRA LOP") {
				let options;
				classMitra.getData().map((val, key) => {
					options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
				});

				this.mitras = `<div class="form-group formMitras frmZebra">
							<label  class="col-sm-3 control-label">Usulan Mitra</label>
							<div class="col-sm-3">
								<select name="nama_mitra[]" data-id="0" id="Mitra1" class="form-control select2form selMit" style="width:100%;" required>
									<option value="" selected disabled>Rekomendasi Mitra</option>
									${options}
								</select>
								<div class="clearfix" style="margin-bottom:10px;"></div>
								<input type="hidden" name="other[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control 0" id="otherMitra1" />
							</div>
							<div class="col-sm-3">
								<input type="text" name="layanan[]" class="form-control" placeholder="Layanan" id="layananMit1" required />
							</div>

							<div class="col-sm-2">
								<div class="col-sm-12" id="mitra0">
								  <input type="number" name="persen_mitra[]" max="100" min="0" id="persen_mitra0" data-top="persen_mitra_tmp0" class="form-control persen_mitra_tmp persen" placeholder="Bobot Layanan" required />
								  <label class="label label-info">%</label>
								  <input type="hidden" name="share_anak_perusahaan_tmp[]" class="tmpshare" id="persen_mitra_tmp0"  />
								</div>
							</div>

							<div class="col-sm-1" style="padding-left:0;">
								<button type="button" id="btnAddMitras" class="btn btn-primary btn-sm">Tambah</button>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="col-sm-9 col-sm-push-3">
										<span style="color: red;" class="help-block">
											*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
										</span>
									</div>
								</div>
							</div>
						</div>`;
				
			}else if (type == "MITRA LOP EDIT") {
				let options;
				classMitra.getData().map((val, key) => {
					options += `<option value="${val.KODE_MITRA}||${val.NAMA_MITRA}">${val.NAMA_MITRA}</option>`;
				});

				this.mitras = `<div class="form-group formMitras frmZebra">
							<label  class="col-sm-3 control-label">Usulan Mitra</label>
							<div class="col-sm-2 ayam mitra-opt-1">
								<select name="nama_mitra_edit[]" data-id="0" id="Mitra1" class="form-control select2form selMit" style="width:100%;" required>
									<option value="" selected disabled>Rekomendasi Mitra</option>
									${options}
								</select>
								<div class="clearfix" style="margin-bottom:10px;"></div>
								<input type="hidden" name="other_edit[]" readonly="readonly" placeholder="Isi Nama Mitra Jika Other" class="form-control 0" id="otherMitra1" />
							</div>
							<div class="col-sm-2">
								<input type="text" name="layanan_edit[]" class="form-control" placeholder="Layanan" id="layananMit1" required />
							</div>

							<div class="col-sm-2">
								<div class="col-sm-12" id="mitra0">
								  <input type="number" name="persen_mitra[]" max="100" min="0" id="persen_mitra0" data-top="persen_mitra_tmp0" class="form-control persen_mitra_tmp persen" placeholder="Bobot Layanan" required />
								  <label class="label label-info">%</label>
								  <input type="hidden" name="share_anak_perusahaan_edit_tmp[]" class="tmpshare" id="persen_mitra_tmp0"  />
								</div>
							</div>

							<input type="hidden" name="idPm[]" id="idPm1" />

							<div class="col-sm-1" style="padding-left:0;">
								<button type="button" id="btnAddMitras" class="btn btn-primary btn-sm">Tambah</button>
							</div>
							<div class="row">
								<div class="col-sm-12">
									<div class="col-sm-9 col-sm-push-3">
										<span style="color: red;" class="help-block">
											*) Jika mitra tidak terdapat pada pilihan, silahkan daftarkan mitra tersebut kepada BDM melalui email <i>bdmdes.numero@gmail.com</i> 
										</span>
									</div>
								</div>
							</div>
						</div>`;
				
			}
		}
	}
/* End Classes BA Spliting */

/* Classes BA Spliting With Mapping Produk */
	class MappingProduct {
		constructor(type){
			if(type == "MITRA"){
				this.mitras = (kode_mitra, nama_mitra, product, index) => {
					// return `
					// 	<div class="form-group formMitras frmZebra">
					// 		<label class="col-sm-3 control-label">Usulan Mitra</label>
					// 		<div class="col-sm-3">
					// 			<label>${nama_mitra}</label>
					// 		</div>
					// 		<div class="col-sm-4">
					// 			<label>${product}</label>
					// 		</div>
					// 		<div class="col-sm-2">
					// 			<div class="input-group" id="mitra${index}">
					// 				<input type="number" name="persen_mitra[]" max="100" min="0" id="persen_mitra0" data-top="persen_mitra_tmp${index}" class="form-control persen_mitra_tmp persen" placeholder="Bobot Layanan" required />
					// 			</div>
					// 		</div>
					// 	</div>
					// `;
					return `
						<div class="form-group formMitras frmZebra">
							<label class="col-sm-3 control-label">Usulan Mitra</label>
							<div class="col-sm-3">
								<label>${nama_mitra}</label>
								<input type="text" name="tmp_mitra_name" class="form-control" value="${nama_mitra}" readonly />
								<input type="hidden" value="${kode_mitra+"||"+nama_mitra}" name="nama_mitra[]" data-id="0" id="Mitra${index}" class="selMit" /> 
							</div>
							<div class="col-sm-4">
								<input type="text" name="layanan[]" value="${product}" class="form-control" placeholder="Layanan" id="layananMit1" readonly required />
							</div>
							<div class="col-sm-2">
								<div class="input-group" id="mitra${index}">
								  <input type="number" name="persen_mitra[]" max="100" min="0" id="persen_mitra0" data-top="persen_mitra_tmp${index}" class="form-control persen_mitra_tmp persen" placeholder="Bobot Layanan" required />
								  <input type="hidden" name="share_anak_perusahaan_tmp[]" class="tmpshare" id="persen_mitra_tmp${index}"  />
								  <span class="input-group-addon addon-blue-jeans">%</span>
								</div>
							</div>
						</div>
					`;
				}
			}else if (type == "TELKOM") {
				this.telkom = (product, index) => {
					return `
						<div class="formLayanan frmZebraLayanan">
									<div class="form-group">
										<label class="col-sm-3 control-label">Pilih Layanan</label>
										<div class="col-sm-3">
											<select name="nama_layanan_telkom[]" id="jenislatel1" class="form-control lynSel" style="width: 100%;" required>
												<option value="" disabled selected>Pilih Layanan Telkom</option>
												<option value="DATIN">DATIN</option>
												<option value="NON_DATIN">NON DATIN</option>
												<option value="WIFI">WIFI</option>
												<option value="INDIHOME">INDIHOME</option>
											</select>
										</div>
										<div class="col-sm-4 titleLyn">
											<input type="text" name="txt_layanan_telkom[]" value="${product}" id="latel${index}" class="form-control name_layanan_telkom" placeholder="Layanan" readonly >
										</div>
										<div class="col-sm-2">
											<div class="input-group">	
											  <input type="number" max="100" min="0" name="persen_layanan[]" id="persen_layanan1" data-top="persen_layanan_tmp${index}" class="col-sm-2 form-control persen_layanan persen" placeholder="Bobot Layanan" required />
											  <input type="hidden" name="share_layanan_tmp[]" class="tmpsharelayanan" id="persen_layanan_tmp${index}" />
											  <span class="input-group-addon addon-blue-jeans">%</span>
											</div>
										</div>
									</div>

									<div class="form-group" id="is_sbr">
										<label for="used_sbr" class="col-sm-3 control-label">Menggunakan SBR</label>
										<div class="col-sm-8">
											<div class="checkbox" style="margin-left:15px;">
												<label class="col-sm-2">
												    <input type="checkbox" name="used_sbr[]" class="used_sbr" id="used_sbr1" value="YA" > Ya
												</label>
												<div class="col-sm-10">
													<label class="col-sm-2">Diskon</label>
													<div class="col-sm-8">
														<div class="col-sm-8">
															<div class="input-group">
																<input type="number" name="diskon[]" id="diskon1" class="form-control diskon_sbr" placeholder="Input Diskon" max="100" />
																<span class="input-group-addon addon-blue-jeans">%</span>
															</div>
														</div>
														<div class="col-sm-4">
															<span class="err_diskon_sbr" style="color: red; display: none; white-space: nowrap;" class="help-block">Diskon tidak boleh lebih dari 100 %</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

								</div>
					`;
				}
			}
		}
	}
/* Classes BA Spliting With Mapping Produk */


/* Classes To Render Estimasi Bulan WIN*/
	class TahunWin {

		constructor(type){
			let periode;
			if(type == "WIN"){
				periode = new FixTahunWin();
			}else if(type == "ADMIN"){
				periode = new AdminTahunWin();
			}else{
				periode = new EstTahunWin();
			}
			return periode.listYear();
		}

	}

	class BulanWin {
		constructor() {
			return {
				"01" : "Januari",
				"02" : "Februari",
				"03" : "Maret",
				"04" : "April",
				"05" : "Mei",
				"06" : "Juni",
				"07" : "Juli",
				"08" : "Agustus",
				"09" : "September",
				"010" : "Oktober",
				"011" : "November",
				"012" : "Desember"
			}
		}	
	} 

	class EstTahunWin {

		constructor(){
			this._type = 'LOP';
			this.listYear = () => {
				
				let list = [],
					index= 0;
				for (let i = new Date().getFullYear() - 1; i < new Date().getFullYear()+2; i++)
				{
					list[index] = i;
					index++;
				}
				return list
			} 	
		}

	}


	class FixTahunWin {

		constructor(){
			this._type = 'WIN';
			this.listYear = () => {
				
				let list = [],
					index= 0;
				for (let i = new Date().getFullYear() - 2 ; i <= new Date().getFullYear(); i++)
				{
					list[index] = i;
					index++;
				}
				return list
			} 	
		}

	}

	class AdminTahunWin {

		constructor(){
			this._type = 'ADMIN';
			this.listYear = () => {
				
				let list = [],
					index= 0;
				for (let i = new Date().getFullYear() - 5 ; i <= new Date().getFullYear() + 1; i++)
				{
					list[index] = i;
					index++;
				}
				return list
			} 	
		}

	}
/* End Classes To Render Estimasi Bulan WIN*/


/* Classes To Render Estimasi Bulan Close*/
	class Scaling {

		constructor (type, tahunClose) {
			if(type == "AREA SCAL"){
				let dateNow 	= new Date();
		  		let thisYear 	= dateNow.getFullYear();
		  		let periodeWon 	= $("#est_thn_close").val();
		  		let lama_kontrak= $("#lama_tahun_kontak").val();
		  		let blnWin 		= $("#est_bln_close").val();
		  		let thnWin 		= $("#est_thn_close").val();
		  		let status_lop 	= $("#status_lop").val();
		  		let winningPrd 	= thnWin+blnWin;
				let areaScal 	= "";
				let jml 		= periodeWon != tahunClose ? (parseInt(tahunClose)+1) - parseInt(periodeWon) : 1;
				let jml2 		= ( ( (parseInt(winningPrd) + parseInt(lama_kontrak)) - parseInt(winningPrd)) +1);
				let kontrak_scl = Math.ceil(jml2/12);
				let est_nilai_sc= status_lop != 'WIN' ? 1 : kontrak_scl;
				
				for(var i=1;i <= est_nilai_sc; i++) {
					let lblCurrYear = ``;
					lblCurrYear = (i > 1) ? `+${i - 1}` : ``;
					areaScal += `<div class="form-group">
									<label for="estimasi_tahun_${i}" class="col-sm-3 control-label">Estimasi Scaling Curr Year ${lblCurrYear} (dalam Rupiah)</label>
									<div class="col-sm-8">
										<input type="text" id="estimasi_tahun_${i}" name="estimasi_tahun[${i}]" data-top="estimasi_tahun_tmp${i}" required class="form-control wonInput estThn currency" placeholder="Estimasi Scaling Tahun ${i} (Dalam Rp)" />
										<input type="hidden" name="estimasi_tahun_tmp[${i}]" id="estimasi_tahun_tmp${i}" />
									</div>
								</div>`;
				}
				this.setAreaScal = areaScal;
			}else if (type == "VALID SCAL") {
				if(tahunClose == "INPUT BC"){
					this.inputbc = () => {
						$("#bulan_bc").val("");
						$("#areaEstThn").html("");
						$(`.periodeBC`).datepicker('remove');
						
						if($("#est_bln_close").val() != '' && $("#est_thn_close").val() != '')
							$("#bulan_bc").prop('readonly', false);

						let arrBulan 	= ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
						let isbulan 	= arrBulan.includes($("#est_bln_close").val());
						let bulan 		= isbulan ? parseInt($("#est_bln_close").val().substr(1)) - 1 : parseInt($("#est_bln_close").val()) - 1;
							bulan 		= bulan ? bulan : 0;  
						$(`.periodeBC`).datepicker({
							format: "yyyymm",
						    minViewMode: 1,
						    keyboardNavigation: false,
						    autoclose: true,
						    startDate: new Date($("#est_thn_close").val() ? $("#est_thn_close").val() : new Date().getFullYear(), bulan)
						}).on('changeDate', function (e) {
							let date 		= $("#bulan_bc").val();
							let tahun 		= date.substring(0, 4);
							let areaScal	= new ComponentLOP("AREA SCAL", tahun);
						    $("#areaEstThn").html(areaScal.setAreaScal);
						    let modif = new ComponentLOP("MODIFY INPUT", "CURRENCY");
							modif.is_currency();
						});
					}
				}
			}
		}

	}	
/* End Classes To Render Estimasi Bulan Close*/

/* Classes To Render Term Of Payment */
	class TermOfPay {

		constructor(type){
			let areaTop;
			if(type == "OTC PREPAID" || type == "OTC POSTPAID"){
				areaTop = `<div class="form-group" id="divOtc">
								<label for="otc" class="col-sm-3 control-label">OTC (Rp)</label>
								<div class="col-sm-8">
									<input type="text" name="otc" id="otc" class="form-control currency" data-top="tmpOtc" placeholder="OTC (Tanpa Koma, contoh : 10000000 )">
									<input type="hidden" name="tmpOtc" id="tmpOtc" />
								</div>
							</div>`;
			}else if (type == "BULANAN"){
				areaTop = `<div class="form-group" id="divRecc">
								<label for="recc" class="col-sm-3 control-label">RECC (Rp)</label>
								<div class="col-sm-8">
									<input type="text" name="recc" id="recc"  class="form-control currency" data-top="tmpRecc" placeholder="RECC (Tanpa Koma, contoh : 10000000 )">
									<input type="hidden" name="tmpRecc" id="tmpRecc" />
								</div>
							</div>`;
			}else if (type == "OTC+BULANAN") {
				areaTop = `<div class="form-group" id="divOtc">
								<label for="otc" class="col-sm-3 control-label">OTC (Rp)</label>
								<div class="col-sm-8">
									<input type="text" name="otc" id="otc"  class="form-control currency" data-top="tmpOtc" placeholder="OTC (Tanpa Koma, contoh : 10000000 )">
									<input type="hidden" name="tmpOtc" id="tmpOtc" />
								</div>
							</div>

							<div class="form-group" id="divRecc">
								<label for="recc" class="col-sm-3 control-label">RECC (Rp)</label>
								<div class="col-sm-8">
									<input type="text" name="recc" id="recc"  class="form-control currency" data-top="tmpRecc" placeholder="RECC (Tanpa Koma, contoh : 10000000 )">
									<input type="hidden" name="tmpRecc" id="tmpRecc" />
								</div>
							</div>`;
			}else if (type == "TERMIN") {
				areaTop = `<div class="form-group" id="divTermin">
								<div id="TerminWrapper">
									<div class="form-group formTermin frmZebraTermin">
										<label class="col-sm-3 control-label">Termin Ke-1</label>
										<div class="col-sm-3">
											<input type="hidden" name="indexTermin[]" class="indexTermin" value="1">
											<input type="text" name="terminInput[]" placeholder="Input Nilai Termin (Rp)" id="Termin1" data-top="TmpTermin1" class="form-control terminInput currency" required>
											<input type="hidden" name="tmpTermin[]" class="tmpTermin" id="TmpTermin1" >
										</div>
										<div class="col-sm-3 dateTermin">
											<input type="text" name="tgl_termin[]" id="periodeTermin1" class="form-control terminDate periodTermin" placeholder="Input Bulan" required>
										</div>
										<div class="col-sm-1" style="padding-left:0;">
											<button type="button" id="btnAddTermin" class="btn btn-primary btn-sm">Tambah</button>
										</div>
									</div>
								</div>
							</div>`;
			}else if (type == "OTHERS") {
				areaTop = `<div id="divUsedBase">
								<div class="col-sm-12 form-group">
									<label class="col-sm-3 control-label">Harga Satuan</label>
									<div class="col-sm-6">
										<input type="text" name="satuanBase" id="satuanBase" class="form-control currency" data-top="tmpSatuanBase" placeholder="Input Harga Satuan">
										<input type="hidden" name="tmpSatuanBase" id="tmpSatuanBase" >
									</div>
								</div>
								<div class="col-sm-12 form-group">
									<label class="col-sm-3 control-label">Est. Total Volume</label>
									<div class="col-sm-6">
										<input type="text" name="totalVolume" id="totalVolume" class="form-control currency" data-top="tmptotalVolume" placeholder="Input Total Est. Volume">
										<input type="hidden" name="tmptotalVolume" id="tmptotalVolume" >
									</div>
								</div>
							</div>`;
			}

			this.rendertop = areaTop;
		}
	}

	class NilaiProject {
		constructor() {
			this.otc = (nilai) => {
				return nilai;
			}

			this.recc = (nilai, bulan) => {
				return parseInt(nilai) * parseInt(bulan);
			}

			this.otc_recc = (n_otc, n_recc, bulan ) => {
				return parseInt(n_otc) + ( parseInt(n_recc) * parseInt(bulan) );
			}

			this.usage_based = (satuan, volume) => {
				return parseInt(satuan) * parseInt(volume);
			}

			this.termin = (arr_value) => {
				let total = 0;
				arr_value.map((val) => {
					total = parseInt(total) + parseInt(val);
				});
				return total;
			}
		}
	}

	class CalcAdpNProject {
		constructor(type) {
			const nilaiProject = new NilaiProject();

			this.total_project = (type, nilai, nilai2 = null, periode = null ) => {
				switch (type) {
					case "OTC PREPAID":
						return nilaiProject.otc(nilai);
						break;
					case "OTC POSTPAID":
						return nilaiProject.otc(nilai);
						break;
					case "BULANAN":
						return nilaiProject.recc(nilai, nilai2);
						break;
					case "OTC+BULANAN":
						return nilaiProject.otc_recc(nilai, nilai2, periode);
						break;
					case "TERMIN":
						return nilaiProject.termin(nilai);
						break;
					default:
						return nilaiProject.usage_based(nilai, nilai2);
						break;
				}
			}
		}
	}

/* End Classes To Render Term Of Payment */

/* Classes To Modify Entitas Input */
	
	class EntitasInput {
		constructor(category){
			if(category == "PROPS"){
				this.entrequired = (elm, entitas, status) => {
					$(`${elm}`).prop(`${entitas}`, status);
				}
			}else if (category == "DISPLAY") {
				this.display = (elm, status, type) => {
					if(status == "SHOW"){
						$(`${elm}`).fadeIn(`${type}`);
					}else{
						$(`${elm}`).fadeOut(`${type}`);
					}
				}
			}
		}
	}

/* End Classes To Modify Entitas Input */

