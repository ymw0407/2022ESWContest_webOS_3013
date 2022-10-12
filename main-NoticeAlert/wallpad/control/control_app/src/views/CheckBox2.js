import React, { useState } from 'react';
import styled from 'styled-components';
import './CheckBox.css';
import LS2Request from '@enact/webos/LS2Request';

const bridge = new LS2Request();

const StyledTable = styled.table`
  text-align: center;
  border-collapse: collapse;
  tbody{
    tr{
      td{
        padding: 10px 10px;
        border-bottom: 5px solid #eee;
        color: white;
        font-size: 25px;
        font-weight: 700;
      }
    }
  }
  .second-row{
    width: 100px;
  }
`;

export default function CheckBox2() {
  const data = [
    {id: 1, name:"wind", title: '1단계'},
    {id: 2, name:"wind", title: '2단계'},
    {id: 3, name:"wind", title: '3단계'},
    {id: 4, name:"wind", title: '4단계'},
    {id: 5, name:"wind", title: '5단계'},
  ];

  // 체크된 아이템을 담을 배열
  const [checkItems2, setCheckItems2] = useState([]);

  function windowPublishService(id){
		let window = {state: id}
		console.log(window);
		var lsRequest = {
			service:"luna://com.control.app.service",
			method:"window",
			parameters: {"window" : window},
			onSuccess: (msg) => {
				console.log(msg.message);
			},
			onFailure: (msg) => {console.log(msg);console.log("error");},
		}
		bridge.send(lsRequest);
	}

  // 체크박스 단일 선택
  const handleSingleCheck = (checked2, id) => {
    if (checked2) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems2(prev => [...prev, id]);
      console.log(checkItems2)
      console.log(setCheckItems2)
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems2(checkItems2.filter((el) => el !== id));
      windowPublishService(id);
    }
  };

  const onlyOne2 = (target2) => {
    document.querySelectorAll(`input[type=checkbox]`)
        .forEach(el2 => el2.checked = false);
    target2.checked = true;
  }


  return (
    <StyledTable>
      <div className='tem'>
        <tbody>
          {data?.map((data, key) => (
            <tr key={key}>
              <td>
                <input type='checkbox' name={`select-${data.name}`}
                  onClick={(e) => onlyOne2(e.target)}
                  onChange={(e) => handleSingleCheck(e.target.checked2, data.id)}
                  // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked2={checkItems2.includes(data.id) ? true : false} />
              </td>
              <td className='second-row'>{data.title}</td>
            </tr>
          ))}
        </tbody>
      </div>
    </StyledTable>
  )
}