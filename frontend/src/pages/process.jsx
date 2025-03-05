import '../App.css'

export default function Process(){
    return(
        <div className="content">
            <div className="form">test</div>
            <table border="1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Pork</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Beef</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Chicken</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
    ) 
}