$(function(){

	$('.rez').on('click', function(){

		let $floor = $('#floor');
		$floor.html('');
		let length_room = Number($('[name="length_room"]').val());
		let w_room = Number($('[name="width_room"]').val());
		let l_lam = Number($('[name="length_lam"]').val());
		let w_lam = Number($('[name="width_lam"]').val());
		let N_pack = Number($('[name="N_pack"]').val());//число панелей в упаковке
		let min_lam = Number($('[name="min_lam"]').val());//число панелей в упаковке
		let indent_walls = Number($('[name="indent_walls"]').val());//отступ от стен
		let way_of_laying = $('[name="way_of_laying"]').val();
		let str="";

		let ch = 0; //флажок на введение некорректных данных
		let k = 1;
		
		if ((length_room<0)||(w_room<0)||(l_lam<0)||(w_lam<0)||(N_pack<0)||(indent_walls<0)||(min_lam<0)||(l_lam<=min_lam)){
			ch++;
		}

		if (ch>0){
			str = "<hr><center>Некорректно веденные данные</center>";
		}else{
			
			length_room = (length_room - 2*(indent_walls/10));//отнимаем отступ от стен
			w_room = (w_room - 2*(indent_walls/10));//отнимаем отступ от стен

			let S_floor = (length_room * w_room / 10000).toFixed(2);
			let sm_px = 600/length_room;

			l_lam = l_lam*sm_px; //l_lam в px
			w_lam = w_lam*sm_px; //w_lam в px
			w_room = w_room*sm_px; //w_room в px
			min_lam = min_lam*sm_px; //min_lam в px
			let l_room = 600; //l_room в px

			$floor.css('height',w_room);
			$floor.css('display','block');
			$('.S_floor').css('display','block');

			let w_lam_in_room = Math.ceil(w_room/w_lam); //кол-во рядов панелей
			
			let N = 1;//количество панелей
			let ost = 0;
			let length_pan = 0;
			let w_ost = w_room - (w_lam_in_room-1)*w_lam;

			function write(i, height, width, N){
				length_pan = Math.ceil((width*length_room*10)/600);//переводим px в мм
				$(`#row_${i}`).append(`<div class='item_lam' style='height:${height}px; width:${width}px'>${N}/${length_pan}</div>`);
			}

			for (let i=1; i<=w_lam_in_room; i++){

				//рисуем строчку
				if (i<w_lam_in_room){
					$("#floor").append(`<div class='row_lam' style='height:${w_lam}px' id='row_${i}'></div>`);
				}else{
					$("#floor").append(`<div class='row_lam' style='height:${w_ost}px' id='row_${i}'></div>`);
				}
				
				
				//рисуем остаток слева
				if (ost>0){

					if (ost<=l_room){

				  		if (i<w_lam_in_room){
				  			write(i, w_lam, ost, N);
						}else{
							write(i, w_ost, ost, N);
						}
						N++;

					}else{

						if (i<w_lam_in_room){
				  			write(i, w_lam, l_room, N);
						}else{
							write(i, w_ost, l_room, N);
						}

					}
				}
				
				if (ost<=l_room){

					let kol =  Math.floor((l_room - ost)/l_lam); //кол-во целых панелей

					for (let j=1; j<=kol; j++){

						if (i<w_lam_in_room){
							write(i, w_lam, l_lam, N);
						}else{
							write(i, w_ost, l_lam, N);
						}
						
						N++;
					}

					ost = l_room - kol*l_lam - ost; //считаем остаток справа для этого ряда

					if(ost>0){
						if (i<w_lam_in_room){
							write(i, w_lam, ost, N);
						}else{
							write(i, w_ost, ost, N);
						}
					}
					
					ost = l_lam - ost; //считаем левый остаток для следующего ряда

					//учитываем минимальную длину обрезка
					if (way_of_laying == 'way_cut'){
						if ((ost<min_lam)&&(i<w_lam_in_room)){
							ost = 0;
							N++;
						}
					}

					//если Со смещением на 1/2 длины
					if (way_of_laying == 'way_two'){
						if ((i%2!=0)&&(ost<(l_lam/2))&&(i<w_lam_in_room)){
							ost = l_lam/2;
							N++;
						}else if((i%2!=0)&&(ost>=(l_lam/2))){
							ost = l_lam/2;
						}else if((i%2==0)&&(i<w_lam_in_room)){
							ost = 0;
							N++;
						}
					}

					if (way_of_laying == 'way_three'){
						if (k==1){
							if (ost<(l_lam/3)){
								ost = l_lam/3;
								N++;
							}else{
								ost = l_lam/3;
							}
							k=2;
						}else if (k==2){
							if (ost<(l_lam*2/3)){
								ost = l_lam*2/3;
								N++;
							}else{
								ost = l_lam*2/3;
							}
							k=3;
						}else if (k==3){
							ost = 0;
							N++;
							k=1
						}
					}

				}else{
					ost = ost - l_room; 
				}

			}


			$('.S_floor').html(`<p>Площадь укладки: ${S_floor} м<sup>2</sup></p>`);

			let N_pack_rez = Math.ceil(N/N_pack); //количество упаковок ламината

			str = `<hr><center>Требуемое количество досок ламината: <span class="big">${N}</span><br>
                    Количество упаковок ламината: <span class="big">${N_pack_rez}</span><br>
					<small>Ниже представлена схема укладки ламината</small></center>`;

		}//end else

		$('.result').html(str);

	});//end on
});//end ready