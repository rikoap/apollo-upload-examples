import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'

const UploadFile = ({ mutate }) => {
  const handleChange = ({
    target: {
      validity,
      files: [file]
    }
  }) =>
    validity.valid &&
    mutate({
      variables: { file },
      update(
        proxy,
        {
          data: { createTextDocument }
        }
      ) {
        const data = proxy.readQuery({ query: uploadsQuery })
        data.uploads.push(createTextDocument)
        proxy.writeQuery({ query: uploadsQuery, data })
      }
    })

  return <input type="file" required onChange={handleChange} />
}

export default graphql(gql`
  mutation($file: Upload!) {
      createTextDocument(input: {
          fileName: "hahah"
          version: "test"
          file: $file
      }) {
          fileName
          chunks(start: 0, end: 10) {
              id
              sentenceIndexStart
              sentenceIndexEnd
              sentences {
                  id
                  content
                  posLabels {
                      l
                      s
                      e
                  }
              }
          }
      }
  }
`)(UploadFile)
