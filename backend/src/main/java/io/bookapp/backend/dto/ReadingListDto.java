package io.bookapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ReadingListDto {

    private Long id;
    private String name;
    private Long userId;
    private List<String> books;

}
